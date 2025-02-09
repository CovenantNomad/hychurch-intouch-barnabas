import { fetchMonthlyAppointments } from '@/repositories/barnabas';
import { useAppointmentStore } from '@/stores/appointmentState';
import { useAuthStore } from '@/stores/authState';
import { useDateStore } from '@/stores/dateStore';
import { TAppointment, TGroupedAppointments } from '@/types/barnabas.types';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';

export function useMonthlyAppointments() {
  const { profile } = useAuthStore();
  const { currentDate } = useDateStore();
  const { setAppointments } = useAppointmentStore();

  const {
    data: appointments = [],
    isLoading,
    isFetching,
  } = useQuery<TAppointment[]>({
    queryKey: ['monthlyAppointments', dayjs(currentDate).format('YYYY-MM')],
    queryFn: () =>
      fetchMonthlyAppointments(
        dayjs(currentDate).year(),
        dayjs(currentDate).month() + 1 // dayjs의 month는 0부터 시작
      ),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const userAppointments = useMemo(() => {
    if (!profile?.id || !appointments) return [];
    return appointments.filter((appt) => appt.barnabaId === profile.id);
  }, [appointments, profile?.id]);

  // ✅ Zustand에 로그인한 유저 일정 저장
  useEffect(() => {
    if (appointments) {
      setAppointments(userAppointments);
    }
  }, [userAppointments, setAppointments, appointments]);

  const groupedAppointments: TGroupedAppointments = useMemo(() => {
    const grouped: TGroupedAppointments = {};
    appointments.forEach((appointment) => {
      if (!grouped[appointment.date]) {
        grouped[appointment.date] = [];
      }
      grouped[appointment.date].push(appointment);
    });
    return grouped;
  }, [appointments]);

  return { groupedAppointments, isLoading, isFetching };
}
