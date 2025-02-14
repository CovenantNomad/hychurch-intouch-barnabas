'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { findProgressMentorships } from '@/repositories/barnabas';
import { useAuthStore } from '@/stores/authState';
import { TMatchingStatus } from '@/types/barnabas.types';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useQuery } from '@tanstack/react-query';
import { MessageSquareXIcon, RotateCcwIcon } from 'lucide-react';
import PendingCard from './_components/PendingCard';
import ProgressCard from './_components/ProgressCard';

const BarnabasOverviews = () => {
  const { profile } = useAuthStore();

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['findProgressMentorships', profile?.id],
    queryFn: () =>
      profile ? findProgressMentorships(profile.id) : Promise.resolve([]),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!profile?.id,
  });

  return (
    <>
      <div className="flex justify-between items-end">
        <div className="flex items-center space-x-2">
          <h3 className="text-[22px] font-semibold tracking-tight">
            {profile ? `${profile.name} 바나바님` : '로그인 필요'}
          </h3>
          <Button size={'sm'} variant={'ghost'} onClick={() => refetch()}>
            <RotateCcwIcon />
          </Button>
        </div>
        <p className="underline text-base">현재진행 : {data?.length || 0}명</p>
      </div>
      <div className="mt-10">
        <div>
          <h4 className="text-lg text-blue-600 font-semibold">진행중인 과정</h4>
          <p className="text-sm text-gray-500 mt-1">
            바나바 과정을 이수하기 위해 열심히 달려가고 있습니다. 🏃
          </p>
          <div className="border-b border-gray-200 mt-5" />
          <div>
            {isLoading ? (
              <Skeleton className="h-[400px] w-[280px] rounded-lg" />
            ) : data &&
              data.length !== 0 &&
              data.filter(
                (course) => course.status === TMatchingStatus.PROGRESS
              ).length !== 0 ? (
              <ScrollArea className="w-full overflow-x-auto whitespace-nowrap mt-4">
                <div className="flex space-x-4">
                  {data
                    .filter(
                      (course) => course.status === TMatchingStatus.PROGRESS
                    )
                    .map((course) => (
                      <ProgressCard key={course.id} course={course} />
                    ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[200px] flex flex-col justify-center items-center mt-4 border rounded-lg">
                <MessageSquareXIcon className="h-6 w-6" />
                <span className="text-sm mt-2">진행중인 과정이 없습니다.</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-10">
          <h4 className="text-lg text-amber-500 font-semibold">
            지연중인 과정
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            바나바 과정이 잠시 지연되고 있습니다. 기도해주세요 🙏🏻
          </p>
          <div className="border-b border-gray-200 mt-5" />
          <div>
            {isLoading ? (
              <Skeleton className="h-[400px] w-[280px] rounded-lg" />
            ) : data &&
              data.length !== 0 &&
              data.filter((course) => course.status === TMatchingStatus.PENDING)
                .length !== 0 ? (
              <ScrollArea className="w-full overflow-x-auto whitespace-nowrap mt-4">
                <div className="flex space-x-4">
                  {data
                    .filter(
                      (course) => course.status === TMatchingStatus.PENDING
                    )
                    .map((course) => (
                      <PendingCard key={course.id} course={course} />
                    ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[200px] flex flex-col justify-center items-center mt-4 border rounded-lg">
                <MessageSquareXIcon className="h-6 w-6" />
                <span className="text-sm mt-2">진행중인 과정이 없습니다.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BarnabasOverviews;
