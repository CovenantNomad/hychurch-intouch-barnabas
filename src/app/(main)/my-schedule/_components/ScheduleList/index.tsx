'use client';

import ViewButton from '@/components/common/ViewButton';
import { Button } from '@/components/ui/button';
import { groupAndSortDailyAppointments } from '@/lib/utils';
import { fetchMonthlyAppointments } from '@/repositories/barnabas';
import { useAuthStore } from '@/stores/authState';
import { useDateStore } from '@/stores/dateStore';
import { TAppointment } from '@/types/barnabas.types';
import { useQuery } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { ChevronLeft, ChevronRight, MessageSquareXIcon } from 'lucide-react';
import { useMemo } from 'react';
import MyAppointmentAccordion from './_components/MyAppointmentAccordion';

const ScheduleList = () => {
  const { profile } = useAuthStore();
  const { currentDate, setCurrentDate } = useDateStore();

  const {
    data: allAppointments = [],
    isLoading,
    refetch,
  } = useQuery<TAppointment[]>({
    queryKey: ['monthlyAppointments', dayjs(currentDate).format('YYYY-MM')],
    queryFn: () =>
      fetchMonthlyAppointments(
        dayjs(currentDate).year(),
        dayjs(currentDate).month() + 1 // dayjs의 month는 0부터 시작
      ),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // 이전 달로 이동
  const handlePrevMonth = () =>
    setCurrentDate((prev: Dayjs) => prev.subtract(1, 'month'));

  // 다음 달로 이동
  const handleNextMonth = () =>
    setCurrentDate((prev: Dayjs) => prev.add(1, 'month'));

  const myAppointments = useMemo(() => {
    return allAppointments.filter((a) => a.barnabaId === profile?.id);
  }, [allAppointments, profile?.id]);

  const sortedAppointments = useMemo(() => {
    return groupAndSortDailyAppointments(myAppointments);
  }, [myAppointments]);

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">월별 만남 일정</h2>
        <div>
          <ViewButton refetch={refetch} />
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

      <>
        {isLoading ? (
          <div className="h-[200px] flex flex-col justify-center items-center border rounded-lg text-gray-400 text-sm">
            <span className="animate-pulse">일정을 불러오는 중입니다...</span>
          </div>
        ) : myAppointments && myAppointments.length !== 0 ? (
          <MyAppointmentAccordion sortedAppointments={sortedAppointments} />
        ) : (
          <div className="h-[200px] flex flex-col justify-center items-center border rounded-lg">
            <MessageSquareXIcon className="h-6 w-6" />
            <span className="text-sm mt-2">일정 없음</span>
          </div>
        )}
      </>
    </>
  );
};

export default ScheduleList;
