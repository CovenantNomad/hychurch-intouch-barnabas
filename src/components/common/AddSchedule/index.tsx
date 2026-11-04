'use client';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useScheduleMutation } from '@/hooks/useScheduleMutation';
import { useDateStore } from '@/stores/dateStore';
import { Dialog } from '@radix-ui/react-dialog';
import dayjs from 'dayjs';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import DateTimePicker from '@/components/common/AddSchedule/_components/DateTimePicker';
import LocationInput from '@/components/common/AddSchedule/_components/LocationInput';
import CourseSelection from '@/components/common/AddSchedule/_components/MatchingSelection';
import WeekIndicator from '@/components/common/AddSchedule/_components/WeekIndicator/WeekIndicator';

const AddSchedule = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { onSubmitHandler, isFormValid, isPending, setDate } =
    useScheduleMutation(setIsOpen);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      const { currentDate, selectedDate } = useDateStore.getState();
      // 이전에 저장된 선택 날짜가 표시 월과 다르면 표시 월을 기준으로 연다.
      const initialDate =
        selectedDate && dayjs(selectedDate).isSame(currentDate, 'month')
          ? selectedDate
          : currentDate;
      setDate(initialDate);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className="-ml-4">
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] max-w-[96%] overflow-y-auto mx-auto px-4">
        <DialogHeader>
          <DialogTitle>일정 등록</DialogTitle>
          <DialogDescription>멘티와의 만남을 등록해주세요</DialogDescription>
        </DialogHeader>
        <div className="pb-0">
          <CourseSelection setIsOpen={setIsOpen} />
          <div className="mt-8 pl-4 py-3 border rounded-lg shadow-sm">
            <WeekIndicator setIsOpen={setIsOpen} />
            {isOpen && <DateTimePicker setIsOpen={setIsOpen} />}
            <LocationInput setIsOpen={setIsOpen} />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <div className="flex flex-col space-y-2">
            <Button
              onClick={onSubmitHandler}
              disabled={!isFormValid || isPending}
            >
              {isPending ? '저장 중...' : '등록'}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              취소
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSchedule;
