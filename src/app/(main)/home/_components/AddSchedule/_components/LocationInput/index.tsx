'use client';

import { useScheduleMutation } from '@/hooks/useScheduleMutation';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const LocationInput = ({ setIsOpen }: Props) => {
  const { place, setPlace } = useScheduleMutation(setIsOpen);
  return (
    <div className="flex justify-between pr-4 pt-2">
      <span>장소</span>
      <input
        value={place}
        onChange={(e) => setPlace(e.target.value)}
        className="w-1/2 text-sm text-right bg-transparent focus:outline-none focus:ring-0 border-0"
        placeholder="장소를 입력해주세요"
      />
    </div>
  );
};

export default LocationInput;
