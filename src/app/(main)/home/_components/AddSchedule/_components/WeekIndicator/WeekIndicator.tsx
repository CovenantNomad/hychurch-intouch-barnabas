'use client';

import { useScheduleMutation } from '@/hooks/useScheduleMutation';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const WeekIndicator = ({ setIsOpen }: Props) => {
  const { selectedCourse } = useScheduleMutation(setIsOpen);

  return (
    <div className="flex justify-between border-b pr-4 pb-3">
      <span>진행 할 주차</span>
      <span>
        {selectedCourse
          ? Number(selectedCourse.completedMeetingCount) + 1 + '주차'
          : ''}
      </span>
    </div>
  );
};

export default WeekIndicator;
