'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useScheduleMutation } from '@/hooks/useScheduleMutation';
import { cn, getMatchingMessage } from '@/lib/utils';
import { findProgressMentorships } from '@/repositories/barnabas';
import { useAuthStore } from '@/stores/authState';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const CourseSelection = ({ setIsOpen }: Props) => {
  const { profile } = useAuthStore();
  const { selectedCourse, setSelectedCourse } = useScheduleMutation(setIsOpen);

  const { isLoading, isFetching, data } = useQuery({
    queryKey: ['findProgressMentorships', profile?.id],
    queryFn: () =>
      profile ? findProgressMentorships(profile.id) : Promise.resolve([]),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!profile?.id,
  });

  return (
    <div className="mt-3">
      <h4 className="font-medium">현재 진행 중인 바나바</h4>
      <p className="text-sm text-gray-600 mb-2">
        먼저, 바나바 과정을 선택해주세요. 진행 할 주차는 자동으로 입력됩니다.
      </p>
      <div className="mt-6">
        {isLoading || isFetching ? (
          <Skeleton className="h-10 w-full" />
        ) : data && data.length !== 0 ? (
          data.map((course) => (
            <div
              key={course.id}
              className={cn(
                'flex justify-between items-center border py-2 px-4 rounded-lg shadow-sm mb-2',
                selectedCourse?.id === course.id ? 'bg-teal-200' : ''
              )}
            >
              <div>
                <span className="inline-block">멘티: {course.menteeName}</span>
                <span className="inline-block text-sm mx-2">
                  ({course.scheduledMeetingCount}주과정 -{' '}
                  {getMatchingMessage(course.status)})
                </span>
              </div>
              <Button
                onClick={() => setSelectedCourse(course)}
                className="rounded-full"
              >
                선택
              </Button>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center border py-4 px-4 rounded-lg shadow-sm">
            <span className="text-sm font-medium text-gray-500">
              현재 진행중인 바나바 과정이 없습니다.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSelection;
