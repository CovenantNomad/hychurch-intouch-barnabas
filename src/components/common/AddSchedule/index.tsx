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
      <DialogContent
        className="flex h-[100dvh] max-h-[100dvh] w-full max-w-full flex-col gap-0 overflow-hidden rounded-none border-0 p-0 data-[state=open]:animate-none data-[state=closed]:animate-none sm:h-[90dvh] sm:max-h-[900px] sm:max-w-lg sm:rounded-xl sm:border"
      >
        <DialogHeader className="shrink-0 border-b px-6 pb-4 pt-[max(1.5rem,env(safe-area-inset-top))] sm:text-center">
          <DialogTitle>일정 등록</DialogTitle>
          <DialogDescription>멘티와의 만남을 등록해주세요</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5">
          <CourseSelection setIsOpen={setIsOpen} />
          <div className="mt-6 rounded-lg border py-3 pl-4 shadow-sm">
            <WeekIndicator setIsOpen={setIsOpen} />
            {isOpen && <DateTimePicker setIsOpen={setIsOpen} />}
            <LocationInput setIsOpen={setIsOpen} />
          </div>
        </div>
        <DialogFooter className="shrink-0 border-t bg-background px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex w-full flex-col gap-2">
            <Button
              className="h-12"
              onClick={onSubmitHandler}
              disabled={!isFormValid || isPending}
            >
              {isPending ? '저장 중...' : '등록'}
            </Button>
            <Button
              className="h-11"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              취소
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSchedule;
