'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useScheduleMutation } from '@/hooks/useScheduleMutation';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { CalendarIcon, Clock4Icon } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const DateTimePicker = ({ setIsOpen }: Props) => {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const { date, hour, minute, setDate, setHour, setMinute } =
    useScheduleMutation(setIsOpen);

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date | undefined) => {
    setDate(date ? dayjs(date).format('YYYY-MM-DD') : undefined);
    setIsDateOpen(false);
  };

  const handleMinuteSelect = (index: number) => {
    setMinute((index * 5).toString());
    setIsTimeOpen(false);
  };

  return (
    <>
      <div className="border-b pr-4 py-2">
        <div className="flex justify-between items-center">
          <span>시간</span>
          <div className="space-x-2">
            {/* {날짜선택} */}
            <Button
              onClick={() => {
                setIsTimeOpen(false);
                setIsDateOpen(!isDateOpen);
              }}
              variant={'outline'}
              className={cn(
                'justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon />
              {date ? (
                dayjs(date).format('YYYY. MM. DD.')
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
            {/* {시간선택} */}
            <Button
              onClick={() => {
                setIsDateOpen(false);
                setIsTimeOpen(!isTimeOpen);
              }}
              variant={'outline'}
              className={cn(
                'justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <Clock4Icon />
              <span>
                {hour.toString().padStart(2, '0')}:
                {minute.toString().padStart(2, '0')}
              </span>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          {isDateOpen && (
            <div className="mt-2">
              <Calendar
                mode="single"
                selected={date ? new Date(date) : undefined}
                onSelect={handleDateSelect}
                initialFocus
              />
            </div>
          )}
          {isTimeOpen && (
            <div className="w-full flex p-3 space-x-4 mt-2">
              <ScrollArea className="h-[261px] w-1/2 rounded-md border">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">
                    시간
                  </h4>
                  {Array.from({ length: 23 }).map((_, index) => (
                    <div key={index}>
                      <div
                        key={index}
                        onClick={() => setHour((index + 1).toString())}
                        className="text-sm cursor-pointer"
                      >
                        {(index + 1).toString().padStart(2, '0')}
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <ScrollArea className="h-[261px] w-1/2 rounded-md border">
                <div className="p-4">
                  <h4 className="mb-4 text-sm font-medium leading-none">분</h4>
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index}>
                      <div
                        onClick={() => handleMinuteSelect(index)}
                        className="text-sm cursor-pointer"
                      >
                        {(index * 5).toString().padStart(2, '0')}
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DateTimePicker;
