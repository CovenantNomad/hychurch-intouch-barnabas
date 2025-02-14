import {
  AppointmentStatus,
  TAppointment,
  TMatchingStatus,
} from '@/types/barnabas.types';
import { clsx, type ClassValue } from 'clsx';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateAge = (birthday: string | null | undefined): string => {
  if (!birthday) return '알 수 없음';

  const birthDate = new Date(birthday);
  if (isNaN(birthDate.getTime())) return '알 수 없음'; // 유효하지 않은 날짜 처리

  const currentYear = new Date().getFullYear();
  const birthYear = birthDate.getFullYear();
  const age = currentYear - birthYear;

  const shortYear = String(birthYear).slice(-2); // YY 형식 추출
  return `${age}세 (${shortYear}년생)`;
};

export function getAppointmentMessage(status: AppointmentStatus): string {
  switch (status) {
    case AppointmentStatus.SCHEDULED:
      return '약속';
    case AppointmentStatus.COMPLETED:
      return '만남';
    case AppointmentStatus.CANCELED:
      return '취소';
    default:
      return '상태를 확인할 수 없습니다.';
  }
}

export function getMatchingMessage(status: TMatchingStatus): string {
  switch (status) {
    case TMatchingStatus.PROGRESS:
      return '진행중';
    case TMatchingStatus.COMPLETED:
      return '수료';
    case TMatchingStatus.FAILED:
      return '보류';
    case TMatchingStatus.PENDING:
      return '지연중';
    default:
      return '상태를 확인할 수 없습니다.';
  }
}

export const getWeeksBetweenDates = (
  startDate: string,
  endDate: string
): number => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  // 날짜 차이를 일(day) 단위로 계산
  const dayDifference = end.diff(start, 'day');

  // 7일 미만은 1주차, 이후는 7일 단위로 올림 처리
  return dayDifference < 7 ? 1 : Math.ceil(dayDifference / 7);
};

export function getDayOfWeek(dateStr: string): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayIndex = dayjs(dateStr).day(); // 0 (일요일) ~ 6 (토요일)
  return days[dayIndex];
}

export const groupAndSortDailyAppointments = (appointments: TAppointment[]) => {
  // 1️⃣ 상태별 그룹화
  const grouped = {
    scheduled: [] as TAppointment[],
    completed: [] as TAppointment[],
    canceled: [] as TAppointment[],
  };

  appointments.forEach((appointment) => {
    if (appointment.status === AppointmentStatus.SCHEDULED) {
      grouped.scheduled.push(appointment);
    } else if (appointment.status === AppointmentStatus.COMPLETED) {
      grouped.completed.push(appointment);
    } else {
      grouped.canceled.push(appointment);
    }
  });

  // 2️⃣ 그룹 내에서 hour → minute → name 순으로 정렬
  const sortAppointments = (appointments: TAppointment[]) => {
    return appointments.sort((a, b) => {
      // 날짜 정렬 (오름차순)
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      // 시간 정렬 (오름차순)
      if (Number(a.hour) !== Number(b.hour)) {
        return Number(a.hour) - Number(b.hour);
      }
      // 분 정렬 (오름차순)
      if (Number(a.minute) !== Number(b.minute)) {
        return Number(a.minute) - Number(b.minute);
      }
      // 이름 정렬 (가나다 순)
      return a.barnabaName.localeCompare(b.barnabaName);
    });
  };

  return {
    scheduled: sortAppointments(grouped.scheduled),
    completed: sortAppointments(grouped.completed),
    canceled: sortAppointments(grouped.canceled),
  };
};

export const getClosestSunday = (): string => {
  // 현재 날짜
  const today = dayjs();

  // 현재 요일 (0 = 일요일, 1 = 월요일, ..., 6 = 토요일)
  const dayOfWeek = today.day();

  // 이번 주 일요일 찾기 (현재 요일에서 dayOfWeek 만큼 빼기)
  const closestSunday = today.subtract(dayOfWeek, 'day');

  // 'YYYY-MM-DD' 형식으로 반환
  return closestSunday.format('YYYY-MM-DD');
};

//바나바 진행기간 구하기
export const getProgressDuration = ({
  matchingDate,
  completedDate,
  lastMeetingDate,
  completedMeetingCount,
  scheduledMeetingCount,
}: {
  matchingDate: string;
  completedDate?: string;
  lastMeetingDate?: string;
  completedMeetingCount: string;
  scheduledMeetingCount: string;
}): number => {
  // 종료일(endDate) 계산 (빈 문자열 무시)
  const validCompletedDate =
    completedDate && completedDate.trim() !== '' ? completedDate : undefined;
  const validLastMeetingDate =
    lastMeetingDate && lastMeetingDate.trim() !== ''
      ? lastMeetingDate
      : undefined;

  // 종료일(endDate) 계산
  const endDate =
    validCompletedDate ?? // 1) 완료일이 있으면 그걸 사용
    (completedMeetingCount === scheduledMeetingCount
      ? validLastMeetingDate ?? dayjs().format('YYYY-MM-DD') // 2) 모든 만남 완료면 마지막 만남일
      : dayjs().format('YYYY-MM-DD')); // 3) 진행 중이면 현재일

  // 기존 유틸함수 getWeeksBetweenDates 활용
  return getWeeksBetweenDates(matchingDate, endDate);
};
