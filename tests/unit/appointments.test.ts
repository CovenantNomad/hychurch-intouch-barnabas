import {
  createAppointment,
  fetchMonthlyAppointments,
  updateAppointment,
} from '@/repositories/barnabas';
import {
  AppointmentStatus,
  TMatchingStatus,
  type TAppointment,
} from '@/types/barnabas.types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const firestore = vi.hoisted(() => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  getDocsFromServer: vi.fn(),
  runTransaction: vi.fn(),
  query: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  where: vi.fn(),
}));

vi.mock('@/configs/firebase', () => ({
  db: {},
  auth: {},
  storage: {},
}));

vi.mock('firebase/firestore', () => firestore);

const input: Omit<TAppointment, 'appointmentId'> = {
  matchingId: 'matching-test',
  barnabaId: 'barnaba-test',
  menteeId: 'mentee-test',
  barnabaName: '테스트 바나바',
  menteeName: '테스트 멘티',
  date: '2026-11-15',
  hour: '13',
  minute: '00',
  place: '테스트 장소',
  week: '1',
  scheduledMeetingCount: '5',
  review: '',
  status: AppointmentStatus.SCHEDULED,
  matchingStatus: TMatchingStatus.PROGRESS,
};

beforeEach(() => {
  vi.resetAllMocks();

  firestore.collection.mockReturnValue({});
  firestore.doc.mockImplementation((...args: unknown[]) => (
    args.length === 1 ? { id: 'appointment-test' } : { id: args.at(-1) }
  ));
  firestore.query.mockReturnValue({});
  firestore.getDocs.mockResolvedValue({ empty: true, docs: [] });
  firestore.setDoc.mockResolvedValue(undefined);
  firestore.getDocsFromServer.mockResolvedValue({ empty: true, docs: [] });
  firestore.runTransaction.mockImplementation(async (_db, callback) => callback({
    get: async () => ({ exists: () => false }),
    set: firestore.setDoc,
  }));

  // 이 초기 테스트에서 예상하지 않은 DB 연산은 즉시 실패시킨다.
  firestore.getDoc.mockImplementation(() => {
    throw new Error('getDoc Mock 설정이 필요합니다.');
  });
  firestore.updateDoc.mockImplementation(() => {
    throw new Error('updateDoc Mock 설정이 필요합니다.');
  });
});

describe('일정 생성', () => {
  it('일정과 중복 방지 문서를 동일 트랜잭션에 저장한다', async () => {
    const result = await createAppointment(input);
    expect(result).toEqual({ ...input, appointmentId: 'appointment-test' });
    expect(firestore.runTransaction).toHaveBeenCalledTimes(1);
    expect(firestore.setDoc).toHaveBeenCalledTimes(2);
    expect(firestore.setDoc).toHaveBeenCalledWith({ id: 'appointment-test' }, result);
    expect(firestore.setDoc).toHaveBeenCalledWith(
      { id: encodeURIComponent(JSON.stringify([input.matchingId, input.week])) },
      { matchingId: input.matchingId, week: input.week, appointmentId: result.appointmentId },
    );
    expect(result.status).toBe('scheduled');
  });

  it.each(['scheduled', 'canceled', 'completed'])(
    '기존 %s 일정은 슬롯이 없어도 신규 생성을 막는다', async (status) => {
      firestore.getDocsFromServer.mockResolvedValueOnce({
        empty: false, docs: [{ data: () => ({ ...input, status }) }],
      });
      await expect(createAppointment(input)).rejects.toThrow('기존 일정을 수정');
      expect(firestore.where).toHaveBeenCalledWith('matchingId', '==', input.matchingId);
      expect(firestore.where).toHaveBeenCalledWith('week', '==', input.week);
      expect(firestore.runTransaction).not.toHaveBeenCalled();
      expect(firestore.setDoc).not.toHaveBeenCalled();
    },
  );

  it('서버 조회 실패 시 저장하지 않는다', async () => {
    firestore.getDocsFromServer.mockRejectedValueOnce(new Error('offline'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(createAppointment(input)).rejects.toThrow('약속 생성에 실패');
    expect(firestore.runTransaction).not.toHaveBeenCalled();
  });

  it('트랜잭션 실패를 성공으로 반환하지 않는다', async () => {
    firestore.runTransaction.mockRejectedValueOnce(new Error('commit failed'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(createAppointment(input)).rejects.toThrow('약속 생성에 실패');
  });

  it('동시 요청의 충돌 재시도에서 한 건만 생성하며 다른 주차는 허용한다', async () => {
    // Firestore의 읽기 버전 검증과 콜백 재시도를 메모리에서 모사한다.
    // 실제 서버 트랜잭션 검증은 Emulator 통합 테스트의 별도 범위다.
    const documents = new Map<string, unknown>();
    let sequence = 0;
    let retries = 0;
    firestore.doc.mockImplementation((...args: unknown[]) => ({
      id: args.length === 1 ? `appointment-${++sequence}` : String(args.at(-1)),
    }));
    firestore.runTransaction.mockImplementation(async (_db, callback) => {
      for (;;) {
        const reads = new Map<string, unknown>();
        const writes = new Map<string, unknown>();
        const result = await callback({
          get: async (ref: { id: string }) => {
            const value = documents.get(ref.id);
            reads.set(ref.id, value);
            return { exists: () => value !== undefined };
          },
          set: (ref: { id: string }, value: unknown) => writes.set(ref.id, value),
        });
        if ([...reads].some(([key, value]) => documents.get(key) !== value)) {
          retries++;
          continue;
        }
        for (const [key, value] of writes) documents.set(key, value);
        return result;
      }
    });
    const results = await Promise.allSettled(
      Array.from({ length: 20 }, () => createAppointment(input)),
    );
    expect(results.filter(result => result.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter(result => result.status === 'rejected')).toHaveLength(19);
    expect(retries).toBeGreaterThan(0);
    expect(documents.size).toBe(2);
    await expect(createAppointment(input)).rejects.toThrow('기존 일정을 수정');
    await expect(createAppointment({ ...input, week: '2' })).resolves.toMatchObject({ week: '2' });
    expect(documents.size).toBe(4);
  });
});

describe('취소 후 기존 일정 수정', () => {
  it('약속(scheduled)으로 변경해도 신규 일정이나 슬롯을 생성하지 않는다', async () => {
    firestore.getDoc
      .mockResolvedValueOnce({ exists: () => true, data: () => ({ ...input, status: 'canceled' }) })
      .mockResolvedValueOnce({ exists: () => true, data: () => ({}) });
    firestore.updateDoc.mockResolvedValue(undefined);
    const changes = { date: '2026-11-20', status: AppointmentStatus.SCHEDULED };
    await expect(updateAppointment('existing-id', changes)).resolves.toEqual({
      appointmentId: 'existing-id', ...changes,
    });
    expect(firestore.updateDoc).toHaveBeenCalledWith({ id: 'existing-id' }, changes);
    expect(firestore.setDoc).not.toHaveBeenCalled();
    expect(firestore.runTransaction).not.toHaveBeenCalled();
  });
});

describe('월별 조회 경계', () => {
  it.each([
    [2026, 11, '2026-11-01', '2026-11-30'],
    [2026, 1, '2026-01-01', '2026-01-31'],
    [2024, 2, '2024-02-01', '2024-02-29'],
  ] as const)(
    '%i년 %i월의 첫날부터 말일까지 조회한다',
    async (year, month, start, end) => {
      await fetchMonthlyAppointments(year, month);

      expect(firestore.where).toHaveBeenCalledWith('date', '>=', start);
      expect(firestore.where).toHaveBeenCalledWith('date', '<=', end);
    },
  );
});
