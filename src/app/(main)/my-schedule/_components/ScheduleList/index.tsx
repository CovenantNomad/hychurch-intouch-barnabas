'use client';

import ViewButton from '@/components/common/ViewButton';
import { Button } from '@/components/ui/button';
import { groupAndSortDailyAppointments } from '@/lib/utils';
import { useAppointmentStore } from '@/stores/appointmentState';
import { useDateStore } from '@/stores/dateStore';
import dayjs, { Dayjs } from 'dayjs';
import { ChevronLeft, ChevronRight, MessageSquareXIcon } from 'lucide-react';
import { useMemo } from 'react';
import MyAppointmentAccordion from './_components/MyAppointmentAccordion';

const ScheduleList = () => {
  const { appointments: myAppointments } = useAppointmentStore();
  const { currentDate, setCurrentDate } = useDateStore();

  // 이전 달로 이동
  const handlePrevMonth = () =>
    setCurrentDate((prev: Dayjs) => prev.subtract(1, 'month'));

  // 다음 달로 이동
  const handleNextMonth = () =>
    setCurrentDate((prev: Dayjs) => prev.add(1, 'month'));

  const filteredAppointments = useMemo(() => {
    return myAppointments
      .filter((appointment) =>
        dayjs(appointment.date).isSame(currentDate, 'month')
      )
      .sort((a, b) =>
        dayjs(a.date).isAfter(dayjs(b.date))
          ? 1
          : dayjs(a.date).isBefore(dayjs(b.date))
          ? -1
          : a.hour.localeCompare(b.hour) || a.minute.localeCompare(b.minute)
      );
  }, [myAppointments, currentDate]);

  const sortedAppointments =
    groupAndSortDailyAppointments(filteredAppointments);

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">월별 만남 일정</h2>
        <div>
          <ViewButton />
        </div>
      </div>
      <div className="flex items-center justify-between mt-8 mb-6">
        <Button
          onClick={handlePrevMonth}
          variant={'outline'}
          className="w-7 h-7 p-0"
        >
          <ChevronLeft size={20} />
        </Button>
        <div className="text-base font-medium">
          {dayjs(currentDate).format('YYYY년 M월')}
        </div>
        <Button
          onClick={handleNextMonth}
          variant={'outline'}
          className="w-7 h-7 p-0"
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      <div className="pb-32">
        {filteredAppointments.length !== 0 ? (
          <MyAppointmentAccordion sortedAppointments={sortedAppointments} />
        ) : (
          <div className="h-[200px] flex flex-col justify-center items-center border rounded-lg">
            <MessageSquareXIcon className="h-6 w-6" />
            <span className="text-sm mt-2">일정 없음</span>
          </div>
        )}
      </div>
    </>
  );
};

export default ScheduleList;
