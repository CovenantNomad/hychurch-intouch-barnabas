'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useScheduleMutation } from '@/hooks/useScheduleMutation';
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
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <div className="absolute bottom-24 right-6 bg-black p-3 rounded-full">
          <PlusIcon className="h-6 w-6 text-white" />
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-[90%]">
        <div className="w-full mx-auto">
          <DrawerHeader>
            <DrawerTitle>일정 등록</DrawerTitle>
            <DrawerDescription>멘티와의 만남을 등록해주세요</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <CourseSelection setIsOpen={setIsOpen} />
            <div className="mt-8 pl-4 py-3 border rounded-lg shadow-sm">
              <WeekIndicator setIsOpen={setIsOpen} />
              <DateTimePicker setIsOpen={setIsOpen} />
              <LocationInput setIsOpen={setIsOpen} />
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={onSubmitHandler} disabled={!isFormValid}>
              Submit
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddSchedule;
