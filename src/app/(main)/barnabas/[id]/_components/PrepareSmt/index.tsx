'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getAppointmentDetails } from '@/repositories/barnabas';
import { useMatchingStore } from '@/stores/matchingState';
import { useQuery } from '@tanstack/react-query';
import { MessageSquareXIcon, RotateCcwIcon } from 'lucide-react';

const PrepareSmt = () => {
  const selectedMatching = useMatchingStore((state) => state.selectedMatching);

  const { isLoading, isFetching, data, refetch } = useQuery({
    queryKey: ['getAppointmentDetails', selectedMatching!.id],
    queryFn: () => getAppointmentDetails(selectedMatching!.id),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!selectedMatching,
  });

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">SMT 준비하기</h4>
        <div className="flex items-center space-x-2">
          {isFetching && (
            <span className="text-xs text-gray-300">새로고침 중...</span>
          )}
          <Button size={'sm'} variant={'ghost'} onClick={() => refetch()}>
            <RotateCcwIcon />
          </Button>
        </div>
      </div>
      <div className="py-4 mx-auto">
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : data && data.length !== 0 ? (
          <div>개발중...</div>
        ) : (
          <div className="h-[200px] flex flex-col justify-center items-center border rounded-lg">
            <MessageSquareXIcon className="h-6 w-6" />
            <span className="text-sm mt-2">
              약속 되어 있는 만남 일정이 없습니다.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrepareSmt;
