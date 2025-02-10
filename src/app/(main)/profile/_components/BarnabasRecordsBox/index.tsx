'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getBarnabasRecords } from '@/repositories/barnabas';
import { useAuthStore } from '@/stores/authState';
import { useQuery } from '@tanstack/react-query';
import {
  RotateCcwIcon,
  UserRoundCheckIcon,
  UserRoundIcon,
  UserRoundXIcon,
} from 'lucide-react';

const BarnabasRecordsBox = () => {
  const { profile } = useAuthStore();

  const { isLoading, isFetching, data, refetch } = useQuery({
    queryKey: ['getBarnabasRecords', profile?.id],
    queryFn: () => getBarnabasRecords(profile!.id),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!profile?.id,
  });

  return (
    <>
      <div className="flex justify-between mt-8">
        <div className="flex-1 flex flex-col justify-center items-center pt-2 pb-4 shadow-md bg-white border-y border-l border-gray-100 rounded-l-lg">
          <div className="text-[36px] font-sans font-thin">
            {isLoading ? (
              <Skeleton className="h-[54px] w-[36px]" />
            ) : data ? (
              data.total
            ) : (
              0
            )}
          </div>
          <div className="text-sm">전체양육기록</div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center pt-2 pb-4 shadow-md bg-gray-100 border-y border-r border-gray-100 rounded-r-lg">
          <div className="text-[36px] font-sans font-thin">
            {isLoading ? (
              <Skeleton className="h-[54px] w-[36px]" />
            ) : data ? (
              data.thisYearpass
            ) : (
              0
            )}
          </div>
          <div className="text-sm">올해양육기록</div>
        </div>
      </div>
      <div className="mt-8">
        <div className="flex justify-between items-center border-b pb-1 mb-4">
          <h3 className="text-lg font-semibold">전체기간 히스토리</h3>
          <div className="flex items-center space-x-2">
            {isFetching && (
              <span className="animate-pulse text-xs text-gray-400">
                새로고침중...
              </span>
            )}
            <Button variant={'ghost'} onClick={() => refetch()}>
              <RotateCcwIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex-1 flex flex-col justify-center items-center pt-4 pb-2">
            <div className="flex items-baseline space-x-1">
              <UserRoundIcon className="h-[14px] w-[14px]" />
              <span className="text-sm">만났던멘티</span>
            </div>
            <div className="text-[36px] font-sans font-thin">
              {isLoading ? (
                <Skeleton className="h-[54px] w-[36px]" />
              ) : data ? (
                data.total
              ) : (
                0
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center pt-4 pb-2">
            <div className="flex items-baseline space-x-1">
              <UserRoundCheckIcon className="h-[14px] w-[14px]" />
              <span className="text-sm">수료한멘티</span>
            </div>
            <div className="text-[36px] font-sans font-thin">
              {isLoading ? (
                <Skeleton className="h-[54px] w-[36px]" />
              ) : data ? (
                data.pass
              ) : (
                0
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center pt-4 pb-2">
            <div className="flex items-baseline space-x-1">
              <UserRoundXIcon className="h-[14px] w-[14px]" />
              <span className="text-sm">보류한멘티</span>
            </div>
            <div className="text-[36px] font-sans font-thin">
              {isLoading ? (
                <Skeleton className="h-[54px] w-[36px]" />
              ) : data ? (
                data.fail
              ) : (
                0
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BarnabasRecordsBox;
