import { db } from '@/configs/firebase';
import {
  BARNABAS_COLLCTION,
  TBarnabasHistory,
  TBarnabasProfile,
  TMatching,
  TMatchingStatus,
  TMenteeAttendance,
  TMenteeProfile,
} from '@/types/barnabas.types';
import dayjs from 'dayjs';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { AppointmentStatus, TAppointment } from '@/types/barnabas.types';

export const fetchBarnabaMembers = async (
  isActive: boolean
): Promise<TBarnabasProfile[]> => {
  try {
    // Firestore 컬렉션 참조
    const barnabasRef = collection(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.DATA,
      BARNABAS_COLLCTION.BARNABAPROFILE
    );

    // Firestore 쿼리 실행 (필요 시 조건 추가 가능)
    const q = query(barnabasRef, where('isActive', '==', isActive)); // isActive가 true인 멤버만 가져옴

    const querySnapshot = await getDocs(q);

    const filteredDocs: TBarnabasProfile[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '', // 기본값 추가
        gender: data.gender ?? null, // undefined 방지
        birthday: data.birthday ?? null,
        isActive: data.isActive ?? false, // 기본값
        registrationYear: data.registrationYear ?? null,
        cohort: data.cohort || 0,
        uid: data.uid ?? null, // uid가 없는 경우도 처리
        email: data.email ?? null,
      };
    });

    return filteredDocs.filter((doc) => !('uid' in doc) || doc.uid === null);
  } catch (error) {
    console.error('Error fetching barnaba members: ', error);
    throw new Error('바나바 멤버를 가져오는 중 에러가 발생했습니다.');
  }
};

{
  /*바나바과정 조회, Recoil안되서 barnabaId 가져오려고 불필요한 조회 많이함*/
}
export async function findProgressMentorships(barnabaId: string) {
  try {
    // 컬렉션 참조
    const barnabasRef = collection(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.DATA,
      BARNABAS_COLLCTION.BARNABAMENTORSHIPS
    );

    // 쿼리 생성
    const q = query(
      barnabasRef,
      where('barnabaId', '==', barnabaId), // barnabaId 일치
      where('status', 'in', [TMatchingStatus.PROGRESS, TMatchingStatus.PENDING]) // status가 progress인 문서만
    );

    // 쿼리 실행
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return []; // 빈 배열 반환
    }

    // 결과 반환
    const mentorships: TMatching[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id, // Firestore 문서 ID
        barnabaId: data.barnabaId || '', // 기본값 추가
        menteeId: data.menteeId || '', // 기본값 추가
        barnabaName: data.barnabaName || '',
        menteeName: data.menteeName || '',
        status: data.status || TMatchingStatus.PENDING, // TMatchingStatus의 기본값 (필요시 수정)
        firstMeetingDate: data.firstMeetingDate || null, // 선택적 필드
        lastMeetingDate: data.lastMeetingDate || null, // 선택적 필드
        matchingDate: data.matchingDate || new Date().toISOString(), // 기본값: 현재 날짜
        completedDate: data.completedDate || null, // 선택적 필드
        completedMeetingCount: data.completedMeetingCount || '0', // 기본값: "0"
        scheduledMeetingCount: data.scheduledMeetingCount || '0', // 기본값: "0"
        description: data.description || '',
      };
    });

    return mentorships;
  } catch (error) {
    console.error('멘토십 찾기 실패:', error);
    throw error;
  }
}

export async function createAppointment(
  submitData: Omit<TAppointment, 'appointmentId'>
) {
  try {
    // Firestore의 MEETINGSCHEDULES 컬렉션 참조
    const barnabasRef = collection(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.DATA,
      BARNABAS_COLLCTION.MEETINGSCHEDULES
    );

    const q = query(
      barnabasRef,
      where('matchingId', '==', submitData.matchingId),
      where('week', '==', submitData.week)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // 중복 문서가 있는 경우 에러 발생
      throw new Error('이미 동일한 주차에 약속이 잡혀있습니다.');
    }

    // 문서 ID 생성 (여기서는 Firestore가 자동 ID 생성)
    const newDocRef = doc(barnabasRef);
    const appointmentWithId: TAppointment = {
      appointmentId: newDocRef.id,
      ...submitData,
    };

    // Firestore에 데이터 저장
    await setDoc(newDocRef, appointmentWithId);

    // 저장된 문서 반환
    return appointmentWithId;
  } catch (error) {
    console.error('약속 생성 에러:', error);
    throw new Error('약속 생성에 실패했습니다. 다시 시도해주세요.');
  }
}

export async function fetchMonthlyAppointments(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1); // 해당 달의 시작일
  const endDate = new Date(year, month, 0); // 해당 달의 마지막일

  const barnabasRef = collection(
    db,
    BARNABAS_COLLCTION.BARNABAS,
    BARNABAS_COLLCTION.DATA,
    BARNABAS_COLLCTION.MEETINGSCHEDULES
  );

  const q = query(
    barnabasRef,
    where('date', '>=', dayjs(startDate).format('YYYY-MM-DD')),
    where('date', '<=', dayjs(endDate).format('YYYY-MM-DD'))
  );

  const querySnapshot = await getDocs(q);

  const appointments: TAppointment[] = querySnapshot.docs.map(
    (doc) => ({
      ...(doc.data() as TAppointment),
      appointmentId: doc.id,
    })
  );

  return appointments;
}

export async function getBarnabasProfile(barnabasId: string) {
  try {
    // 특정 Barnabas 프로필 문서 참조
    const barnabasRef = doc(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.DATA,
      BARNABAS_COLLCTION.BARNABAPROFILE,
      barnabasId
    );

    // Firestore에서 해당 문서 가져오기
    const docSnap = await getDoc(barnabasRef);

    if (!docSnap.exists()) {
      throw new Error(
        `❗바나바에 대한 데이터가 존재하지 않습니다. ID: ${barnabasId}`
      );
    }

    // 데이터 반환
    return docSnap.data() as TBarnabasProfile;
  } catch (error) {
    console.error('@BarnabasProfile 가져오기 실패:', error);
    throw new Error('바나바에 대한 데이터를 가져오는 중 오류가 발생했습니다.');
  }
}

export async function getMenteeProfile(menteeId: string) {
  try {
    // 특정 Barnabas 프로필 문서 참조
    const menteeRef = doc(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.DATA,
      BARNABAS_COLLCTION.MENTEEPROFILE,
      menteeId
    );

    // Firestore에서 해당 문서 가져오기
    const docSnap = await getDoc(menteeRef);

    if (!docSnap.exists()) {
      throw new Error(
        `❗바나바에 대한 데이터가 존재하지 않습니다. ID: ${menteeId}`
      );
    }

    // 데이터 반환
    return docSnap.data() as TMenteeProfile;
  } catch (error) {
    console.error('@BarnabasProfile 가져오기 실패:', error);
    throw new Error('바나바에 대한 데이터를 가져오는 중 오류가 발생했습니다.');
  }
}

// 약속ID로 약속정보 가져오는 함수
export async function getAppointmentById(
  appointmentId: string
): Promise<TAppointment | null> {
  try {
    // 약속 일정 컬렉션 참조
    const appointmentRef = doc(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.DATA,
      BARNABAS_COLLCTION.MEETINGSCHEDULES,
      appointmentId
    );

    const docSnap = await getDoc(appointmentRef);

    if (!docSnap.exists()) {
      console.warn(
        `❗일치하는 약속이 없습니다. appointmentId: ${appointmentId}`
      );
      return null;
    }

    return {
      ...(docSnap.data() as TAppointment),
      appointmentId: docSnap.id,
    };
  } catch (error) {
    console.error('🔥 getAppointmentById 실패:', error);
    throw new Error('약속 정보를 가져오는 중 오류가 발생했습니다.');
  }
}

// 매칭ID로 바나바매칭과 연관된 약속정보 가져오는 함수
export async function getAppointmentDetails(
  matchingId: string
): Promise<TAppointment[]> {
  try {
    // 특정 Meeting Schedule 컬렉션 참조
    const appointmentRef = collection(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.DATA,
      BARNABAS_COLLCTION.MEETINGSCHEDULES
    );

    // Firestore에서 해당 matchingId와 일치하는 모든 문서 조회
    const q = query(appointmentRef, where('matchingId', '==', matchingId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(`❗ 일치하는 약속이 없습니다. matchingId: ${matchingId}`);
      return []; // 데이터가 없을 경우 빈 배열 반환
    }

    // 모든 문서 데이터를 배열로 변환하여 반환
    return querySnapshot.docs.map((doc) => ({
      ...(doc.data() as TAppointment),
      appointmentId: doc.id,
    }));
  } catch (error) {
    console.error('🔥 getAppointmentDetails 실패:', error);
    throw new Error('약속 세부 정보를 가져오는 중 오류가 발생했습니다.');
  }
}

export async function updateAppointment(
  appointmentId: string,
  updatedData: Partial<TAppointment>
) {
  try {
    // Firestore 문서 참조
    const appointmentRef = doc(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.DATA,
      BARNABAS_COLLCTION.MEETINGSCHEDULES,
      appointmentId
    );

    // 문서가 존재하는지 확인
    const docSnap = await getDoc(appointmentRef);
    if (!docSnap.exists()) {
      throw new Error('해당 약속을 찾을 수 없습니다.');
    }

    const appointmentData = docSnap.data() as TAppointment;

    // Firestore 문서 업데이트
    await updateDoc(appointmentRef, updatedData);

    await updateMatchingData(
      appointmentData.matchingId,
      updatedData.date,
      appointmentData.week,
      updatedData.status
    );

    return { appointmentId, ...updatedData };
  } catch (error) {
    console.error('❌ 약속 업데이트 에러:', error);
    throw new Error('약속 업데이트에 실패했습니다. 다시 시도해주세요.');
  }
}

async function updateMatchingData(
  matchingId: string,
  date?: string,
  week?: string,
  status?: AppointmentStatus
) {
  try {
    if (!matchingId || !date) return;

    // Firestore에서 해당 매칭 정보 가져오기
    const matchingRef = doc(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.DATA,
      BARNABAS_COLLCTION.BARNABAMENTORSHIPS,
      matchingId
    );

    const matchingSnap = await getDoc(matchingRef);
    if (!matchingSnap.exists()) {
      console.warn(`⚠️ 매칭 데이터(${matchingId})를 찾을 수 없습니다.`);
      return;
    }

    const matchingData = matchingSnap.data() as TMatching;
    const updatedMatchingData: Partial<TMatching> = {};

    if (status === 'completed') {
      // ✅ 마지막 만남 날짜 업데이트
      updatedMatchingData.lastMeetingDate = date;

      // ✅ 첫 번째 만남 날짜 설정 (week이 1이면)
      if (week === '1' && !matchingData.firstMeetingDate) {
        updatedMatchingData.firstMeetingDate = date;
      }

      // ✅ 진행된 만남 횟수 증가
      updatedMatchingData.completedMeetingCount = week;
    }

    // ✅ 약속이 `CANCELED`이면 매칭 상태를 `PENDING`으로 변경
    if (status === AppointmentStatus.CANCELED) {
      updatedMatchingData.status = TMatchingStatus.PENDING;
    }

    // ✅ 약속이 `SCHEDULED`이면 매칭 상태를 `PROGRESS`으로 변경
    if (status === AppointmentStatus.SCHEDULED) {
      updatedMatchingData.status = TMatchingStatus.PROGRESS;
    }

    // Firestore에 업데이트
    await updateDoc(matchingRef, updatedMatchingData);
  } catch (error) {
    console.log('@updateMatchingData: ', error);
    throw new Error('매칭 업데이트에 실패했습니다.');
  }
}

export async function updateAppointmentReview(
  appointmentId: string,
  review: string
) {
  try {
    // Firestore 문서 참조
    const appointmentRef = doc(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.DATA,
      BARNABAS_COLLCTION.MEETINGSCHEDULES,
      appointmentId
    );

    // 문서가 존재하는지 확인
    const docSnap = await getDoc(appointmentRef);
    if (!docSnap.exists()) {
      throw new Error('해당 약속을 찾을 수 없습니다.');
    }

    // Firestore 문서 업데이트 (리뷰만 변경)
    await updateDoc(appointmentRef, { review });

    return { appointmentId, review };
  } catch (error) {
    console.error('❌ 리뷰 업데이트 에러:', error);
    throw new Error('리뷰 업데이트에 실패했습니다. 다시 시도해주세요.');
  }
}

export const getBarnabasRecords = async (profileId: string) => {
  try {
    const currentYear = dayjs().year();

    const historyRef = doc(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.STATS,
      BARNABAS_COLLCTION.HISTORY,
      profileId
    );

    const thisYearHistoryRef = collection(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.STATS,
      BARNABAS_COLLCTION.HISTORY,
      profileId,
      BARNABAS_COLLCTION.BARNABASDETAILS
    );

    const q = query(
      thisYearHistoryRef,
      where('status', 'in', [TMatchingStatus.COMPLETED, TMatchingStatus.FAILED])
    );

    const [docSnap, querySnapshot] = await Promise.all([
      getDoc(historyRef),
      getDocs(q),
    ]);

    const filteredDocs = querySnapshot.docs.filter((doc) => {
      const data = doc.data();
      return (
        data.completedDate >= `${currentYear}-01-01` &&
        data.completedDate <= `${currentYear}-12-31`
      );
    });

    // pass와 fail 분류
    let thisYearpass = 0;
    filteredDocs.forEach((doc) => {
      const data = doc.data();
      if (data.status === TMatchingStatus.COMPLETED) {
        thisYearpass++;
      }
    });

    if (docSnap.exists()) {
      const { total, pass, fail } = docSnap.data();
      return { total, pass, fail, thisYearpass };
    } else {
      console.warn('⚠️ 해당 프로필의 기록을 찾을 수 없습니다.');
      return {
        total: 0,
        pass: 0,
        fail: 0,
        thisYearpass: 0,
      };
    }
  } catch (error) {
    console.error('@getBarnabasRecords:', error);
    throw new Error('데이터를 가져오는 데 실패했습니다.');
  }
};

export const getBarnabasYearlyRecords = async (
  profileId: string,
  year: number
): Promise<TBarnabasHistory[]> => {
  try {
    const historyRef = collection(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.STATS,
      BARNABAS_COLLCTION.HISTORY,
      profileId,
      BARNABAS_COLLCTION.BARNABASDETAILS
    );

    const q = query(
      historyRef,
      where('status', 'in', [
        TMatchingStatus.COMPLETED,
        TMatchingStatus.FAILED,
      ]),
      where('completedDate', '>=', `${year}-01-01`),
      where('completedDate', '<=', `${year}-12-31`)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    const yearlyRecords: TBarnabasHistory[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        matchingId: doc.id, // Firestore 문서 ID
        completedDate: data.completedDate,
        matchingDate: data.matchingDate,
        menteeId: data.menteeId,
        menteeName: data.menteeName,
        scheduledMeetingCount: data.scheduledMeetingCount,
        status: data.status,
      } as TBarnabasHistory;
    });

    return yearlyRecords;
  } catch (error) {
    console.error('@getBarnabasYearlyRecords:', error);
    throw new Error('데이터를 가져오는 데 실패했습니다.');
  }
};

export const createMenteeAttendance = async (
  inputData: TMenteeAttendance
): Promise<TMenteeAttendance> => {
  try {
    const attendanceRef = doc(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.DATA,
      BARNABAS_COLLCTION.ATTENDANCES,
      BARNABAS_COLLCTION.DATE,
      inputData.date,
      inputData.menteeId
    );

    await setDoc(attendanceRef, inputData);

    return inputData;
  } catch (error) {
    console.error('@createMenteeAttendance:', error);
    throw new Error('멘티 출석 데이터를 제출하는 데 실패했습니다.');
  }
};

export const checkAttendanceSubmit = async (
  date: string,
  menteeId: string
): Promise<boolean> => {
  try {
    const attendanceRef = doc(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.DATA,
      BARNABAS_COLLCTION.ATTENDANCES,
      BARNABAS_COLLCTION.DATE,
      date,
      menteeId
    );

    const docSnap = await getDoc(attendanceRef);

    if (docSnap.exists()) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('@checkAttendanceSubmit:', error);
    throw new Error('멘티 예배출석 제출 여부를 조회하는데 실패했습니다.');
  }
};

export async function getMentorshipById(
  matchingId: string
): Promise<TMatching | null> {
  try {
    // 컬렉션 참조
    const barnabasRef = doc(
      db,
      BARNABAS_COLLCTION.BARNABAS,
      BARNABAS_COLLCTION.DATA,
      BARNABAS_COLLCTION.BARNABAMENTORSHIPS,
      matchingId
    );

    // 쿼리 실행
    const docSnap = await getDoc(barnabasRef);

    if (!docSnap.exists()) {
      console.warn(`⚠️ 멘토십(${matchingId})을 찾을 수 없습니다.`);
      return null; // 데이터가 없을 경우 null 반환
    }

    // 결과 반환
    const data = docSnap.data();
    return {
      id: docSnap.id,
      barnabaId: data.barnabaId || '',
      menteeId: data.menteeId || '',
      barnabaName: data.barnabaName || '',
      menteeName: data.menteeName || '',
      status: data.status || TMatchingStatus.PENDING,
      firstMeetingDate: data.firstMeetingDate || null,
      lastMeetingDate: data.lastMeetingDate || null,
      matchingDate: data.matchingDate || new Date().toISOString(),
      completedDate: data.completedDate || null,
      completedMeetingCount: data.completedMeetingCount || '0',
      scheduledMeetingCount: data.scheduledMeetingCount || '0',
      description: data.description || '',
    };
  } catch (error) {
    console.error('❌ 멘토십 찾기 실패:', error);
    throw new Error('멘토십 정보를 불러오는 데 실패했습니다.');
  }
}
