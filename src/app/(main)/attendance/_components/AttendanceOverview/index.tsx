'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { findProgressMentorships } from '@/repositories/barnabas';
import { useAuthStore } from '@/stores/authState';
import { useQuery } from '@tanstack/react-query';
import { MessageSquareXIcon, RotateCcwIcon } from 'lucide-react';
import AttendanceListitem from './_components/AttendanceListitem';

const AttendanceOverview = () => {
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
      <div className="mt-10 pb-12">
        <h4 className="text-lg text-gray-900 font-semibold">
          주일예배 출석체크
        </h4>
        <p className="text-sm text-gray-500 mt-1">
          멘티들의 이번주 주일예배 출석체크를 진행해 주세요.
        </p>
        <div className="mt-8">
          {isLoading ? (
            <Skeleton className="h-[400px] w-[280px] rounded-lg" />
          ) : data && data.length !== 0 ? (
            <div className="border-t">
              {data.map((course) => (
                <AttendanceListitem key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex flex-col justify-center items-center mt-4 border rounded-lg">
              <MessageSquareXIcon className="h-6 w-6" />
              <span className="text-sm mt-2">진행중인 과정이 없습니다.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AttendanceOverview;
