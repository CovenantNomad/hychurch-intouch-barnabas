import { getWeeksBetweenDates } from '@/lib/utils';
import { useMatchingStore } from '@/stores/matchingState';
import { TMatching } from '@/types/barnabas.types';
import Link from 'next/link';

type Props = {
  course: TMatching;
};

const PendingCard = ({ course }: Props) => {
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
          <div className="flex flex-col justify-center items-center w-24 h-24 rounded-full bg-amber-200 text-gray-700 shadow-md z-10">
            <span>{course.menteeName}</span>
            <span className="text-sm">멘티</span>
          </div>
          <div className="w-full absolute -bottom-12 flex px-10 pt-4 pb-5 bg-amber-50">
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
        <div className="bg-amber-50 mt-12 pt-3 pb-6">
          <div className="mx-6 border pl-4 rounded-md">
            <div className="flex justify-between py-2 pr-4 text-sm">
              <span>교육기간</span>
              <span>
                {course.lastMeetingDate
                  ? getWeeksBetweenDates(
                      course.matchingDate,
                      course.lastMeetingDate
                    ) + 1
                  : 0}
                주
              </span>
            </div>
            <div className="flex justify-between py-2 pr-4 text-sm border-y">
              <span>처음만난날</span>
              <span>{course.firstMeetingDate || '아직 못 만났어요'}</span>
            </div>
            <div className="flex justify-between py-2 pr-4 text-sm">
              <span>마지막만난날</span>
              <span>{course.lastMeetingDate || '아직 못 만났어요'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PendingCard;
