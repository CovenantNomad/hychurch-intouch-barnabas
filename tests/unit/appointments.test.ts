import {
  createAppointment,
  fetchMonthlyAppointments,
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
  firestore.doc.mockReturnValue({ id: 'appointment-test' });
  firestore.query.mockReturnValue({});
  firestore.getDocs.mockResolvedValue({ empty: true, docs: [] });
  firestore.setDoc.mockResolvedValue(undefined);

  // 이 초기 테스트에서 예상하지 않은 DB 연산은 즉시 실패시킨다.
  firestore.getDoc.mockImplementation(() => {
    throw new Error('getDoc Mock 설정이 필요합니다.');
  });
  firestore.updateDoc.mockImplementation(() => {
    throw new Error('updateDoc Mock 설정이 필요합니다.');
  });
});

describe('일정 생성', () => {
  it('생성한 ID와 입력 데이터를 저장하고 반환한다', async () => {
    const result = await createAppointment(input);

    expect(result).toEqual({
      appointmentId: 'appointment-test',
      ...input,
    });
    expect(firestore.setDoc).toHaveBeenCalledTimes(1);
    expect(firestore.setDoc).toHaveBeenCalledWith(
      { id: 'appointment-test' },
      result,
    );
  });

  it('동일 과정·주차가 이미 있으면 저장하지 않는다', async () => {
    firestore.getDocs.mockResolvedValueOnce({
      empty: false,
      docs: [],
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(createAppointment(input)).rejects.toThrow();

    expect(firestore.where).toHaveBeenCalledWith(
      'matchingId',
      '==',
      input.matchingId,
    );
    expect(firestore.where).toHaveBeenCalledWith('week', '==', input.week);
    expect(firestore.setDoc).not.toHaveBeenCalled();
  });

  it('저장 실패를 성공으로 반환하지 않는다', async () => {
    firestore.setDoc.mockRejectedValueOnce(new Error('write failed'));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(createAppointment(input)).rejects.toThrow(
      '약속 생성에 실패했습니다.',
    );
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
