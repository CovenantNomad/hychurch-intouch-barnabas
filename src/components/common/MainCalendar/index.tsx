'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDateStore } from '@/stores/dateStore';
import { TAppointment, TGroupedAppointments } from '@/types/barnabas.types';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import ViewButton from '../ViewButton';

type Props = {
  groupedAppointments: TGroupedAppointments;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<TAppointment[], Error>>;
};

export default function MainCalendar({ groupedAppointments, refetch }: Props) {
  const { currentDate, selectedDate, setCurrentDate, setSelectedDate } =
    useDateStore();
  // 날짜 배열 생성 (useMemo로 최적화)
  const days = useMemo(() => {
    const startOfMonth = dayjs(currentDate).startOf('month');
    const endOfMonth = dayjs(currentDate).endOf('month');

    const startDay = startOfMonth.startOf('week');
    const endDay = endOfMonth.endOf('week');

    const totalDays = endDay.diff(startDay, 'day') + 1;
    return Array.from({ length: totalDays }, (_, i) => startDay.add(i, 'day'));
  }, [currentDate]);

  // 이전 달로 이동
  const handlePrevMonth = () =>
    setCurrentDate((prev: Dayjs) => prev.subtract(1, 'month'));

  // 다음 달로 이동
  const handleNextMonth = () =>
    setCurrentDate((prev: Dayjs) => prev.add(1, 'month'));

  return (
    <>
      {/* 상단 네비게이션 */}
      <div className="relative flex justify-center px-6 mb-6">
        <div className="flex items-center space-x-8">
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
        <div className="absolute right-6 -top-1">
          <ViewButton refetch={refetch} />
        </div>
      </div>

      <div className="flex justify-end space-x-4 px-5 mb-1 text-xs">
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-blue-500 mr-1" />
          <span>오늘</span>
        </div>
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-rose-500 mr-1" />
          <span>선택한 날짜</span>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className="p-2">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 렌더링 */}
      <div className="grid grid-cols-7 text-center border-b">
        {days.map((day, index) => {
          const dateKey = day.format('YYYY-MM-DD'); // 날짜 키 생성
          const appointmentCount = groupedAppointments[dateKey]?.length || 0; // 해당 날짜의 약속 수

          return (
            <div
              key={index}
              onClick={() => setSelectedDate(day)}
              className={cn(
                'h-[56px] flex flex-col justify-start items-center border-t pt-1 cursor-pointer',
                day.isSame(currentDate, 'month')
                  ? 'text-black'
                  : 'text-gray-300',
                day.day() === 0 && 'text-red-500'
              )}
            >
              <span
                className={cn(
                  'h-7 w-7 rounded-full flex items-center justify-center text-sm',
                  day.isSame(dayjs(), 'day') // 오늘 날짜
                    ? 'bg-blue-500 text-white'
                    : day.isSame(selectedDate, 'day') // 선택된 날짜
                    ? 'bg-rose-500 text-white'
                    : ''
                )}
              >
                {day.date()}
              </span>
              {/* 일정 갯수 렌더링 */}
              {appointmentCount > 0 && (
                <div className="text-xs text-gray-400 mt-0.5">
                  +{appointmentCount}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
