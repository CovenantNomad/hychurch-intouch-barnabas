import { useToast } from '@/hooks/use-toast';
import { getProgressDuration } from '@/lib/utils';
import { useDelayAlertStore } from '@/stores/delayAlertStore';
import { useMatchingStore } from '@/stores/matchingState';
import { TMatching } from '@/types/barnabas.types';
import Link from 'next/link';
import { useEffect } from 'react';

type Props = {
  course: TMatching;
};

const ProgressCard = ({ course }: Props) => {
  const { hasShownProgressToast, setHasShownProgressToast } =
    useDelayAlertStore();
  const { toast } = useToast();

  useEffect(() => {
    const duration = getProgressDuration({
      matchingDate: course.matchingDate,
      completedDate: course.completedDate,
      lastMeetingDate: course.lastMeetingDate,
      completedMeetingCount: course.completedMeetingCount,
      scheduledMeetingCount: course.scheduledMeetingCount,
    });
    if (!hasShownProgressToast && duration > 8) {
      toast({
        title: '🚨 바나바 진행기간 알림',
        description: (
          <>
            {course.menteeName} 멘티와의 과정이 {duration}주째 진행 중입니다.
            <br />
            진행 상황을 확인해주세요.
          </>
        ),
        variant: 'destructive',
        duration: 5000,
      });

      setHasShownProgressToast(true);
    }
  }, [course, toast, hasShownProgressToast, setHasShownProgressToast]);

  const setSelectedMatching = useMatchingStore(
    (state) => state.setSelectedMatching
  );

  const handleClick = () => {
    setSelectedMatching(course);
  };

  return (
    <Link href={`/barnabas/${course.id}`} passHref>
      <div
        className="w-[280px] rounded-lg border overflow-hidden"
        onClick={handleClick}
      >
        <div className="relative flex flex-col items-center pt-8">
          <div className="flex flex-col justify-center items-center w-24 h-24 rounded-full bg-indigo-200 text-gray-900 shadow-md z-10">
            <span>{course.menteeName}</span>
            <span className="text-sm">멘티</span>
          </div>
          <div className="w-full absolute -bottom-12 flex px-10 pt-4 pb-5 bg-indigo-50">
            <div className="flex-1 flex flex-col items-start text-gray-700">
              <span className="block text-sm">진행</span>
              <span className="block mt-1">
                {course.completedMeetingCount}주
              </span>
            </div>
            <div className="flex-1 flex flex-col items-end text-gray-700">
              <span className="block text-sm">계획</span>
              <span className="block mt-1">
                {course.scheduledMeetingCount}주
              </span>
            </div>
          </div>
        </div>
        <div className="bg-indigo-50 mt-12 pt-3 pb-6">
          <div className="mx-6 border pl-4 rounded-md">
            <div className="flex justify-between py-2 pr-4 text-sm">
              <span>교육기간</span>
              <span>
                {getProgressDuration({
                  matchingDate: course.matchingDate,
                  completedDate: course.completedDate,
                  lastMeetingDate: course.lastMeetingDate,
                  completedMeetingCount: course.completedMeetingCount,
                  scheduledMeetingCount: course.scheduledMeetingCount,
                })}
                주
              </span>
            </div>
            <div className="flex justify-between py-2 pr-4 text-sm border-y">
              <span>첫만남일</span>
              <span>{course.firstMeetingDate || '아직 못 만났어요'}</span>
            </div>
            <div className="flex justify-between py-2 pr-4 text-sm">
              <span>마지막만남일</span>
              <span>{course.lastMeetingDate || '아직 못 만났어요'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProgressCard;
