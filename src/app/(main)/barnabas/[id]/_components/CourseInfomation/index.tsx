'use client';

import { Button } from '@/components/ui/button';
import { getMatchingMessage } from '@/lib/utils';
import { getMentorshipById } from '@/repositories/barnabas';
import { useMatchingStore } from '@/stores/matchingState';
import { TMatchingStatus } from '@/types/barnabas.types';
import { useQuery } from '@tanstack/react-query';
import { LinkIcon, RotateCcwIcon } from 'lucide-react';
import BarnabaProfileCard from './_components/BarnabaProfileCard';
import MenteeProfileCard from './_components/MenteeProfileCard';

const CourseInfomation = () => {
  const selectedMatching = useMatchingStore((state) => state.selectedMatching);

  const { isFetching, data, refetch } = useQuery({
    queryKey: ['getMentorshipById', selectedMatching!.id],
    queryFn: () => getMentorshipById(selectedMatching!.id),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!selectedMatching,
    initialData: selectedMatching,
  });

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center">
          <h4 className="font-medium mr-2">바나바 과정</h4>
          <div className="flex items-center space-x-2">
            <Button size={'sm'} variant={'ghost'} onClick={() => refetch()}>
              <RotateCcwIcon />
            </Button>
            {isFetching && (
              <span className="text-xs text-gray-300">새로고침 중...</span>
            )}
          </div>
        </div>
        {data ? (
          <div
            className={`text-white text-sm px-1.5 py-0.5 rounded-full ${
              data.status === TMatchingStatus.PROGRESS
                ? 'bg-emerald-500'
                : data.status === TMatchingStatus.COMPLETED
                ? 'bg-blue-500'
                : data.status === TMatchingStatus.PENDING
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
          >
            {getMatchingMessage(data.status)}
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div>
        {data ? (
          <>
            <div className="">
              <div className="relative flex justify-center items-center space-x-2 py-4 mx-auto">
                {/* Left Card */}
                <BarnabaProfileCard barnabasId={data.barnabaId} />

                {/* VS Section */}
                <div className="absolute flex items-center justify-center left-1/2 top-1/2 transform -translate-x-[70%] -translate-y-1/2">
                  <span className="bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-bold z-10">
                    <LinkIcon className="h-4 w-4" />
                  </span>
                </div>

                {/* Right Card */}
                <MenteeProfileCard menteeId={data.menteeId} />
              </div>
            </div>
            <div className="py-6 mt-2 mx-auto">
              <div className="border rounded-lg py-2">
                <div className="flex justify-between space-x-6 pb-2 px-4 text-sm">
                  <div className="flex-1 flex justify-between">
                    <span>진행횟수</span>
                    <span>{data.completedMeetingCount}회</span>
                  </div>
                  <div className="flex-1 flex justify-between">
                    <span>예정횟수</span>
                    <span>{data.scheduledMeetingCount}회</span>
                  </div>
                </div>
                <div className="flex justify-between space-x-6 py-2 px-4 border-t border-b text-sm">
                  <div className="flex-1 flex justify-between">
                    <span>매칭일</span>
                    <span>{data.matchingDate || '미정'}</span>
                  </div>
                  <div className="flex-1 flex justify-between">
                    <span>완료일</span>
                    <span>{data.completedDate || '미정'}</span>
                  </div>
                </div>
                <div className="flex justify-between space-x-6 pt-2 px-4 text-sm">
                  <div className="flex-1 flex justify-between">
                    <span>최초만남</span>
                    <span>{data.firstMeetingDate || '미정'}</span>
                  </div>
                  <div className="flex-1 flex justify-between">
                    <span>최근만남</span>
                    <span>{data.lastMeetingDate || '미정'}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-[140px] flex justify-center items-center py-6">
            <span>현재 진행중인 바나바 과정이 없습니다.</span>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseInfomation;
