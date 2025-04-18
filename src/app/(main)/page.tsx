'use client';

import AddSchedule from '@/components/common/AddSchedule';
import AppointmentList from '@/components/common/AppointmentList';
import Header from '@/components/common/Header';
import { MainDropdownMenu } from '@/components/common/Header/_components/MainDropdownMenu';
import MainCalendar from '@/components/common/MainCalendar';
import { useMonthlyAppointments } from '@/hooks/useMonthlyAppointments';
import { useDateStore } from '@/stores/dateStore';
import dayjs from 'dayjs';

export default function Home() {
  const { selectedDate } = useDateStore();
  // 일정 데이터
  const { groupedAppointments, isLoading, isFetching, refetch } =
    useMonthlyAppointments();

  const selectedAppointments =
    selectedDate &&
    groupedAppointments[dayjs(selectedDate).format('YYYY-MM-DD')]
      ? groupedAppointments[dayjs(selectedDate).format('YYYY-MM-DD')]
      : [];

  return (
    <>
      <Header
        left={<AddSchedule />}
        center={<div>CALENDAR</div>}
        right={<MainDropdownMenu />}
      />
      <div className="relative flex-1 pt-6 pb-32 overflow-y-auto">
        <MainCalendar
          groupedAppointments={groupedAppointments}
          refetch={refetch}
        />
        <AppointmentList
          appointments={selectedAppointments}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </div>
    </>
  );
}
