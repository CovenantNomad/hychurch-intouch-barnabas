export enum Gender {
  /** 남성 */
  Man = 'MAN',
  /** 여성 */
  Woman = 'WOMAN',
}

export enum UserGrade {
  /** 인터치 예배와 셀모임 모두 잘 참석하는 인원의 등급 */
  A = 'A',
  /** 셀모임 미참석하는 인원의 등급1 (셀장평가에 의해 결정) */
  B = 'B',
  /** 셀모임 미참석하는 인원의 등급2 (셀장평가에 의해 결정) */
  C = 'C',
  /** 셀모임 미참석하는 인원의 등급3 (셀장평가에 의해 결정) */
  D = 'D',
  /** 셀미편성 인원 중 어떤 예배든지 참석하는 인원의 등급 */
  E = 'E',
  /** 셀미편성 인원 중 예배도 미참석하는 인원의 등급(유령회원) */
  F = 'F',
  /** 결혼, 진급, 이사 등으로 인터치에서 제외된 인원의 등급 */
  G = 'G',
}

export enum RoleType {
  /** 관리자 (목사님, 간사님) */
  Admin = 'ADMIN',
  /** 바나바 멘토 */
  BarnabaMentor = 'BARNABA_MENTOR',
  /** 셀 리더 */
  CellLeader = 'CELL_LEADER',
  /** 운영자 (개발자 등) */
  Operator = 'OPERATOR',
  /** 부 리더 */
  ViceLeader = 'VICE_LEADER',
}

export enum BARNABAS_COLLCTION {
  BARNABAS = 'Barnabas',
  DATA = 'DATA',
  STATS = 'STATS',
  HISTORY = 'HISTORY',
  BARNABAPROFILE = 'BarnabaProfile',
  MENTEEPROFILE = 'MenteeProfile',
  BARNABAMENTORSHIPS = 'BarnabaMentorships',
  AMAZINGMENTORSHIPS = 'AmazingMentorships',
  MEETINGSCHEDULES = 'MeetingSchedules',
  ATTENDANCES = 'Attendances',
  BARNABASDETAILS = 'barnabasDetails',
}

export type TBarnabasProfile = {
  id: string; // 고유 ID
  name: string; // 이름
  gender?: Gender | null; // 성별 (선택적)
  birthday?: string | null; // 생년월일 (선택적)
  isActive: boolean;
  cohort: string;
  uid?: string;
  email?: string;
};

export enum TMatchingStatus {
  PENDING = 'pending',
  FAILED = 'failed',
  PROGRESS = 'progress',
  COMPLETED = 'completed',
}

// SMT 타입
export type TSMT = {
  isDone: boolean; // SMT(특별한 1회성 만남) 완료 여부
  date?: string;
};

// Matching 타입
export type TMatching = {
  id: string; // 매칭 ID
  barnabaId: string; // 바나바 ID
  menteeId: string; // 멘티 ID
  barnabaName: string;
  menteeName: string;
  status: TMatchingStatus; // 매칭 상태
  firstMeetingDate?: string; // 첫 만남 날짜 (ISO 8601 형식)
  lastMeetingDate?: string; // 마지막 만남 날짜 (ISO 8601 형식)
  matchingDate: string; // 매칭 시작일 (ISO 8601 형식)
  completedDate?: string; // 매칭 완료일 (ISO 8601 형식, 선택적)
  completedMeetingCount: string; // 진행된 만남 횟수
  scheduledMeetingCount: string; // 예정된 만남 횟수
  description: string;
};

export enum AppointmentStatus {
  SCHEDULED = 'scheduled', // 약속 잡은 상태
  COMPLETED = 'completed', // 완료
  CANCELED = 'canceled', // 약속 취소
}

export type TAppointment = {
  appointmentId: string;
  matchingId: string; // 매칭 ID
  barnabaId: string; // 바나바 ID
  menteeId: string; // 멘티 ID
  barnabaName: string;
  menteeName: string;
  date: string;
  hour: string;
  minute: string;
  place: string;
  week: string;
  scheduledMeetingCount: string;
  review: string;
  status: AppointmentStatus;
};

export type TGroupedAppointments = {
  [date: string]: TAppointment[];
};

export type TMenteeProfile = {
  id: string;
  name: string;
  birthday?: string | null | undefined;
  gender?: Gender | null | undefined;
  phone: string;
  address?: string | null | undefined;
  registrationDate?: string | null | undefined;
  description?: string | null | undefined;
};

export type TBarnabasHistory = {
  matchingId: string; // 매칭 ID
  menteeId: string; // 멘티 ID
  menteeName: string;
  status: TMatchingStatus; // 매칭 상태
  matchingDate: string; // 매칭 시작일 (ISO 8601 형식)
  completedDate?: string; // 매칭 완료일 (ISO 8601 형식, 선택적)
  scheduledMeetingCount: string; // 예정된 만남 횟수
};
