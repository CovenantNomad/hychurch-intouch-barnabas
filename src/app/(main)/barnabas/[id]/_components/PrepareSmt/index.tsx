'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getAppointmentDetails } from '@/repositories/barnabas';
import { useMatchingStore } from '@/stores/matchingState';
import { useQuery } from '@tanstack/react-query';
import { CircleOffIcon, MessageSquareXIcon, RotateCcwIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReportPopup from './_components/ReportPopup';

const PrepareSmt = () => {
  const [isMobile, setIsMobile] = useState(false);
  const selectedMatching = useMatchingStore((state) => state.selectedMatching);

  const { isLoading, isFetching, data, refetch } = useQuery({
    queryKey: ['getAppointmentDetails', selectedMatching!.id],
    queryFn: () => getAppointmentDetails(selectedMatching!.id),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!selectedMatching,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px 이하를 모바일로 간주
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        ) : selectedMatching && data ? (
          !isMobile ? (
            <div className="flex flex-col justify-center items-center border rounded-lg py-10">
              <p className="text-[15px] mb-8 text-center">
                보고서는 기존에 작성했던 만남후기와 데이터를 바탕으로 자동생성
                됩니다.
                <br />
                만남후기를 변경하고 싶으시면, 세부일정에서 [자세히보기]를 눌러서
                <br />
                [만남후기]를 수정해주시고, 새로고침 버튼 한번 눌러주세요
              </p>
              <ReportPopup course={selectedMatching} appointments={data} />
            </div>
          ) : (
            <div className="h-[200px] flex flex-col justify-center items-center border rounded-lg">
              <CircleOffIcon />
              <span className="text-sm mt-3">PC에서 접속해주세요.</span>
            </div>
          )
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
