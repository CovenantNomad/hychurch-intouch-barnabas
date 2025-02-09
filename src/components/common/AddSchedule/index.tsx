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
import { Dialog } from '@radix-ui/react-dialog';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import DateTimePicker from './_components/DateTimePicker';
import LocationInput from './_components/LocationInput';
import CourseSelection from './_components/MatchingSelection';
import WeekIndicator from './_components/WeekIndicator/WeekIndicator';

const AddSchedule = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { onSubmitHandler, isFormValid } = useScheduleMutation(setIsOpen);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className="p-2">
          <PlusIcon className="h-6 w-6" />
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
            <DateTimePicker setIsOpen={setIsOpen} />
            <LocationInput setIsOpen={setIsOpen} />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <div className="flex flex-col space-y-2">
            <Button onClick={onSubmitHandler} disabled={!isFormValid}>
              등록
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
