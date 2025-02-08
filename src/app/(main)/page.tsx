'use client';

import Header from '@/components/common/Header';
import MainCalendar from '@/components/common/MainCalendar';
import { useMonthlyAppointments } from '@/hooks/useMonthlyAppointments';
import { useDateStore } from '@/stores/dateStore';
import dayjs from 'dayjs';
import AddSchedule from './home/_components/AddSchedule';
import AppointmentList from './home/_components/AppointmentList';

export default function Home() {
  const { selectedDate } = useDateStore();
  // 일정 데이터
  const { groupedAppointments } = useMonthlyAppointments();

  const selectedAppointments =
    selectedDate &&
    groupedAppointments[dayjs(selectedDate).format('YYYY-MM-DD')]
      ? groupedAppointments[dayjs(selectedDate).format('YYYY-MM-DD')]
      : [];

  return (
    <div className="relative min-h-svh">
      <Header
        left={<Header.ViewButton text="내 일정" path="/my-schedule" />}
        center={<div>CALENDAR</div>}
        right={<AddSchedule />}
      />
      <MainCalendar groupedAppointments={groupedAppointments} />
      <AppointmentList appointments={selectedAppointments} />
    </div>
  );
}
