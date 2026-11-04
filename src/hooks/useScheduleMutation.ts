import { useToast } from '@/hooks/use-toast';
import { createAppointment } from '@/repositories/barnabas';
import { useAppointmentStore } from '@/stores/appointmentState';
import { useDateStore } from '@/stores/dateStore';
import { useScheduleStore } from '@/stores/scheduleState';
import {
  AppointmentStatus,
  TAppointment,
  TMatching,
} from '@/types/barnabas.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useRef } from 'react';

export function useScheduleMutation(
  setIsOpen: Dispatch<SetStateAction<boolean>>
) {
  const queryClient = useQueryClient();
  const submissionInFlight = useRef(false);
  const { toast } = useToast();
  const { appointments: userAppointments } = useAppointmentStore();
  const {
    date,
    hour,
    minute,
    place,
    selectedCourse,
    setDate,
    setHour,
    setMinute,
    setPlace,
    setSelectedCourse,
  } = useScheduleStore();

  const showToast = (title: string, description: string) => {
    toast({ title, description });
  };

  // ✅ 제출 버튼 활성화 여부 체크
  const isFormValid =
    date !== undefined &&
    hour !== undefined &&
    minute !== undefined &&
    place.trim() !== '' &&
    selectedCourse !== null;

  // 약속 중복 입력 체크
  const isDuplicateAppointment = (
    userAppointments: TAppointment[],
    selectedCourse: TMatching | null
  ) => {
    const duplicate = userAppointments.find(
      (appointment) =>
        appointment.matchingId === selectedCourse?.id &&
        appointment.week ===
          (Number(selectedCourse.completedMeetingCount) + 1).toString()
    );

    if (duplicate) {
      showToast(
        '❗️중복 일정',
        `이미 ${duplicate.week}주차 일정이 등록되어 있습니다.`
      );
      return true;
    }
    return false;
  };

  // 입력값 초기화 함수 (재사용 가능)
  const resetForm = () => {
    setDate(undefined);
    setPlace('');
    setSelectedCourse(null);
    setIsOpen(false);
  };

  const handleSuccess = async (data: TAppointment) => {
    const queryKey = [
      'monthlyAppointments',
      dayjs(data.date).format('YYYY-MM'),
    ];

    // 저장 전에 시작한 조회가 새 일정을 덮어쓰지 않도록 중단한다.
    await queryClient.cancelQueries({ queryKey, exact: true });
    queryClient.setQueryData<TAppointment[]>(queryKey, (appointments = []) => [
      ...appointments.filter(
        (appointment) => appointment.appointmentId !== data.appointmentId
      ),
      data,
    ]);

    useDateStore.getState().setSelectedDate(dayjs(data.date));
    showToast(
      '✅ 약속 생성 성공',
      `${dayjs(data.date).format('YYYY. MM. DD.')} 약속이 저장되었습니다`
    );

    // 처음 여는 달도 전체 목록을 재조회하되, 저장 결과는 즉시 표시한다.
    void queryClient.invalidateQueries({
      queryKey,
      exact: true,
      refetchType: 'all',
    });

    resetForm(); // ✅ 입력값 초기화 함수 호출
  };

  const handleError = (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : '알 수 없는 오류입니다.';
    console.log('에러: ', errorMessage);

    showToast('❗️약속 생성 실패', errorMessage);
  };

  const mutation = useMutation({
    mutationFn: (data: Omit<TAppointment, 'appointmentId'>) =>
      createAppointment(data), // TAppointment 타입 데이터 전달
    onSuccess: handleSuccess,
    onError: handleError,
    onSettled: () => {
      submissionInFlight.current = false;
    },
  });

  const onSubmitHandler = () => {
    // React가 다시 렌더링되기 전의 연속 클릭도 차단한다.
    if (submissionInFlight.current || mutation.isPending) return;

    if (!isFormValid)
      return showToast(
        '제출실패',
        '과정을 선택하시고, 날짜와 시간, 장소를 입력해주세요.'
      );
    if (!selectedCourse)
      return showToast('제출실패', '바나바 과정을 선택해주세요.');
    if (isDuplicateAppointment(userAppointments, selectedCourse)) return;

    const submissionData: Omit<TAppointment, 'appointmentId'> = {
      matchingId: selectedCourse.id,
      barnabaId: selectedCourse.barnabaId,
      menteeId: selectedCourse.menteeId,
      barnabaName: selectedCourse.barnabaName,
      menteeName: selectedCourse.menteeName,
      date: dayjs(date).format('YYYY-MM-DD'),
      hour: hour.toString().padStart(2, '0'),
      minute: minute.toString().padStart(2, '0'),
      place,
      week: (Number(selectedCourse.completedMeetingCount) + 1).toString(),
      scheduledMeetingCount: selectedCourse.scheduledMeetingCount,
      review: '',
      status: AppointmentStatus.SCHEDULED,
      matchingStatus: selectedCourse.status,
    };

    submissionInFlight.current = true;
    mutation.mutate(submissionData);
  };

  return {
    date,
    setDate,
    hour,
    setHour,
    minute,
    setMinute,
    place,
    setPlace,
    selectedCourse,
    setSelectedCourse,
    isFormValid,
    isPending: mutation.isPending,
    onSubmitHandler,
  };
}
