'use client';

import { getClosestSunday } from '@/lib/utils';
import { checkAttendanceSubmit } from '@/repositories/barnabas';
import { TMatching } from '@/types/barnabas.types';
import { useQuery } from '@tanstack/react-query';
import { LoaderIcon } from 'lucide-react';
import CheckAttendance from '../CheckAttendance';

type Props = {
  course: TMatching;
};

const AttendanceListitem = ({ course }: Props) => {
  const sunday = getClosestSunday();

  const { isLoading, data: submitCheck } = useQuery({
    queryKey: ['checkAttendanceSubmit', sunday, course.menteeId],
    queryFn: () => checkAttendanceSubmit(sunday, course.menteeId),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!course,
  });

  return (
    <div className="flex items-center py-4 border-b">
      <div className="flex-1">
        <p className="text-xl font-normal">
          {course.menteeName}
          <span className="inline-block text-sm ml-2">멘티</span>
        </p>
      </div>
      <div>
        {isLoading ? (
          <LoaderIcon className="animate-spin" />
        ) : submitCheck && submitCheck === true ? (
          <span
            className={
              'w-[50px] h-[50px] flex justify-center items-center rounded-full text-white text-xs bg-blue-500'
            }
          >
            제출
          </span>
        ) : (
          <CheckAttendance sunday={sunday} course={course} />
        )}
      </div>
    </div>
  );
};

export default AttendanceListitem;
