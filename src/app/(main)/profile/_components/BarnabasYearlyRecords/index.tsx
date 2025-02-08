'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, getMatchingMessage } from '@/lib/utils';
import { getBarnabasYearlyRecords } from '@/repositories/barnabas';
import { useAuthStore } from '@/stores/authState';
import { TMatchingStatus } from '@/types/barnabas.types';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight, MessageSquareXIcon } from 'lucide-react';
import { useState } from 'react';

const BarnabasYearlyRecords = () => {
  const [currentYear, setCurrentYear] = useState(dayjs().year());
  const { profile } = useAuthStore();

  const { isLoading, isFetching, data } = useQuery({
    queryKey: ['getBarnabasYearlyRecords', profile?.id, currentYear],
    queryFn: () => getBarnabasYearlyRecords(profile!.id, currentYear),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!profile?.id,
  });

  // 이전 연도로 이동
  const handlePrevYear = () => {
    if (currentYear > 2023) {
      setCurrentYear((prev) => prev - 1);
    }
  };

  // 다음 연도로 이동
  const handleNextYear = () => {
    if (currentYear < dayjs().year()) {
      setCurrentYear((prev) => prev + 1);
    }
  };

  return (
    <div className="mt-12">
      <h3 className="border-b pb-1 mb-4 text-lg font-semibold">
        연도별 히스토리
      </h3>
      <div>
        <div className="flex items-center justify-center space-x-8 my-8">
          <Button
            onClick={handlePrevYear}
            variant="ghost"
            className="p-0 w-10 h-10"
            disabled={currentYear <= 2023}
          >
            <ChevronLeft size={24} />
          </Button>
          <div className="text-base font-medium">{currentYear}</div>
          <Button
            onClick={handleNextYear}
            variant="ghost"
            className="p-0 w-10 h-10"
            disabled={currentYear >= dayjs().year()}
          >
            <ChevronRight size={24} />
          </Button>
        </div>
        <div className="border-y divide-y">
          {isLoading || isFetching ? (
            <Skeleton />
          ) : data && data.length !== 0 ? (
            data.map((record) => (
              <div key={record.matchingId} className="flex items-center py-4">
                <div className="mr-6">
                  <span className="w-[50px] h-[50px] flex justify-center items-center bg-gray-300 text-gray-700 rounded-full">
                    {dayjs(record.completedDate).month() + 1}월
                  </span>
                </div>
                <div className="flex-1 flex flex-col space-y-1">
                  <div>
                    <span className="text-xl font-normal mr-2">
                      {record.menteeName}
                    </span>
                    <span className="text-sm">멘티</span>
                  </div>
                  <div>
                    <span className="text-sm mr-2">
                      ({record.scheduledMeetingCount}주과정)
                    </span>
                    <span className="text-sm">
                      {record.matchingDate} ~ {record.completedDate}
                    </span>
                  </div>
                </div>
                <div>
                  <span
                    className={cn(
                      'w-[50px] h-[50px] flex justify-center items-center rounded-full text-white text-xs',
                      record.status === TMatchingStatus.COMPLETED &&
                        'bg-blue-500',
                      record.status === TMatchingStatus.FAILED && 'bg-amber-500'
                    )}
                  >
                    {getMatchingMessage(record.status)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="h-[200px] flex flex-col justify-center items-center border-x">
              <MessageSquareXIcon className="h-6 w-6" />
              <span className="text-sm mt-2">히스토리 없음</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarnabasYearlyRecords;
