'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { updateAppointment } from '@/repositories/barnabas';
import { AppointmentStatus, TAppointment } from '@/types/barnabas.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { CalendarIcon, Clock4Icon } from 'lucide-react';
import { ReactNode, useState } from 'react';

type Props = {
  appointment: TAppointment;
  triggerComponent: ReactNode;
};

const UpdateAppointment = ({ appointment, triggerComponent }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [updatedAppointment, setUpdatedAppointment] =
    useState<TAppointment>(appointment);

  // 상태 변경 핸들러
  const handleStatusChange = (status: AppointmentStatus) => {
    setUpdatedAppointment((prev) => ({ ...prev, status }));
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setUpdatedAppointment((prev) => ({
        ...prev,
        date: dayjs(date).format('YYYY-MM-DD'),
      }));
      setIsDateOpen(false);
    }
  };

  // 시간 선택 핸들러
  const handleTimeSelect = (hour: number, minute: number) => {
    setUpdatedAppointment((prev) => ({
      ...prev,
      hour: hour.toString().padStart(2, '0'),
      minute: minute.toString().padStart(2, '0'),
    }));
  };

  // 장소 입력 핸들러
  const handlePlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedAppointment((prev) => ({
      ...prev,
      place: e.target.value,
    }));
  };

  // 후기 입력 핸들러
  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUpdatedAppointment((prev) => ({
      ...prev,
      review: e.target.value,
    }));
  };

  const mutation = useMutation({
    mutationFn: ({
      appointmentId,
      updatedData,
    }: {
      appointmentId: string;
      updatedData: Partial<TAppointment>;
    }) => updateAppointment(appointmentId, updatedData), // TAppointment 타입 데이터 전달

    onSuccess: (data) => {
      toast({
        title: '✅ 약속 업데이트 성공',
        description: `${dayjs(data.date).format(
          'YYYY. MM. DD.'
        )} 약속이 업데이트 되었습니다.`,
      });
      queryClient.refetchQueries({
        queryKey: ['getAppointmentDetails'],
      });
      queryClient.refetchQueries({
        queryKey: ['findProgressMentorships'],
      });
      queryClient.refetchQueries({
        queryKey: [
          'monthlyAppointments',
          dayjs(updatedAppointment.date).format('YYYY-MM'),
        ],
      });
      setIsOpen(false);
    },

    onError: (error) => {
      toast({
        title: '❗️약속 업데이트 실패',
        description:
          error instanceof Error ? error.message : '알 수 없는 오류입니다.',
      });
    },
  });

  // 변경 사항 저장
  const handleSaveChanges = () => {
    if (!updatedAppointment.appointmentId) {
      toast({
        title: '❗️오류',
        description: '유효한 일정의 ID가 없습니다.',
      });
      return;
    }

    mutation.mutate({
      appointmentId: updatedAppointment.appointmentId,
      updatedData: {
        date: updatedAppointment.date,
        hour: updatedAppointment.hour,
        minute: updatedAppointment.minute,
        place: updatedAppointment.place,
        status: updatedAppointment.status,
        review: updatedAppointment.review,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent className="max-w-[382px] md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>일정관리</DialogTitle>
          <DialogDescription>
            바나바 만남에 대한 상태와 일정변경을 여기서 진행해주세요.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div>
            <div className="flex items-baseline space-x-2 mb-2">
              <h4 className="font-semibold">일정상태</h4>
              <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                <TooltipTrigger asChild>
                  <span
                    className="text-sm"
                    onClick={() => setIsTooltipOpen(true)}
                  >
                    (처음이라면 터치해서 필독!)
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900">
                  <p className="text-xs text-gray-200 mb-0.5">
                    ∙ 현재 [약속취소] 상태면, [만남예정]을 선택하고 일정을
                    변경해주세요.
                  </p>
                  <p className="text-xs text-gray-200 mb-0.5">
                    ∙ 단순한 일정 변경은 [만남예정] 상태에서 진행해주세요.
                  </p>
                  <p className="text-xs text-gray-200 mb-0.5">
                    ∙ 다음 약속이 잡히지 않을때만 [약속취소]를 선택해주세요.{' '}
                    <br />
                    <span className="ml-1.5">
                      (기존 약속된 일정은 그대로 두셔도 됩니다.)
                    </span>
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div>
              <div className="grid grid-cols-3 text-center border divide-x rounded-lg overflow-hidden">
                {[
                  {
                    label: '취소',
                    value: AppointmentStatus.CANCELED,
                    color: 'bg-amber-500',
                  },
                  {
                    label: '약속',
                    value: AppointmentStatus.SCHEDULED,
                    color: 'bg-emerald-500',
                  },
                  {
                    label: '완료',
                    value: AppointmentStatus.COMPLETED,
                    color: 'bg-blue-500',
                  },
                ].map((item) => {
                  const isDisabled =
                    updatedAppointment.status === AppointmentStatus.CANCELED &&
                    item.value === AppointmentStatus.COMPLETED; // ✅ 취소된 경우 '완료' 선택 불가능

                  return (
                    <div
                      key={item.value}
                      className={cn(
                        'text-sm text-white py-3 cursor-pointer transition-colors',
                        isDisabled
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' // ❌ 비활성화 스타일
                          : updatedAppointment.status === item.value
                          ? item.color
                          : 'bg-gray-100 text-gray-400'
                      )}
                      onClick={() => {
                        if (!isDisabled) handleStatusChange(item.value);
                      }}
                    >
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-1">
              일정변경{' '}
              <span className="text-xs text-gray-500">
                (취소/완료 상태에서는 일정변경 불가)
              </span>
            </h4>
            <div className="border rounded-lg py-2">
              <div className="border-b px-4 pb-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">시간</span>
                  <div className="space-x-2">
                    {/* {날짜선택} */}
                    <Button
                      onClick={() => {
                        setIsTimeOpen(false);
                        setIsDateOpen(!isDateOpen);
                      }}
                      disabled={
                        updatedAppointment.status ===
                          AppointmentStatus.CANCELED ||
                        updatedAppointment.status ===
                          AppointmentStatus.COMPLETED
                      }
                      variant={'outline'}
                      className={cn(
                        'justify-start text-left font-normal',
                        !updatedAppointment.date && 'text-muted-foreground',
                        updatedAppointment.status ===
                          AppointmentStatus.CANCELED && 'bg-gray-300',
                        updatedAppointment.status ===
                          AppointmentStatus.COMPLETED && 'bg-gray-300'
                      )}
                    >
                      <CalendarIcon />
                      {updatedAppointment.date ? (
                        dayjs(updatedAppointment.date).format('YYYY. MM. DD.')
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
                      disabled={
                        updatedAppointment.status ===
                          AppointmentStatus.CANCELED ||
                        updatedAppointment.status ===
                          AppointmentStatus.COMPLETED
                      }
                      variant={'outline'}
                      className={cn(
                        'justify-start text-left font-normal',
                        !updatedAppointment.hour && 'text-muted-foreground',
                        updatedAppointment.status ===
                          AppointmentStatus.CANCELED && 'bg-gray-300',
                        updatedAppointment.status ===
                          AppointmentStatus.COMPLETED && 'bg-gray-300'
                      )}
                    >
                      <Clock4Icon />
                      <span>
                        {updatedAppointment.hour}:{updatedAppointment.minute}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  {isDateOpen && (
                    <div className="mt-2">
                      <Calendar
                        mode="single"
                        selected={dayjs(updatedAppointment.date).toDate()}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </div>
                  )}
                  {isTimeOpen && (
                    <div className="flex p-3 space-x-4 mt-2">
                      <ScrollArea className="h-[261px] w-32 rounded-md border">
                        <div className="p-4">
                          <h4 className="mb-4 text-sm font-medium leading-none">
                            시간
                          </h4>
                          {Array.from({ length: 23 }).map((_, index) => (
                            <div key={index}>
                              <div
                                key={index}
                                onClick={() =>
                                  handleTimeSelect(
                                    index + 1,
                                    Number(updatedAppointment.minute)
                                  )
                                }
                                className="text-sm cursor-pointer"
                              >
                                {(index + 1).toString().padStart(2, '0')}
                              </div>
                              <Separator className="my-2" />
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <ScrollArea className="h-[261px] w-32 rounded-md border">
                        <div className="p-4">
                          <h4 className="mb-4 text-sm font-medium leading-none">
                            분
                          </h4>
                          {Array.from({ length: 12 }).map((_, index) => (
                            <div key={index}>
                              <div
                                onClick={() =>
                                  handleTimeSelect(
                                    Number(updatedAppointment.hour),
                                    index * 5
                                  )
                                }
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
              <div className="flex justify-between px-4 pt-3 pb-1">
                <span className="text-sm">장소</span>
                <input
                  value={updatedAppointment.place}
                  onChange={handlePlaceChange}
                  disabled={
                    updatedAppointment.status === AppointmentStatus.CANCELED ||
                    updatedAppointment.status === AppointmentStatus.COMPLETED
                  }
                  className={cn(
                    'w-1/2 text-sm text-right bg-transparent focus:outline-none focus:ring-0 border-0',
                    'disabled:cursor-not-allowed'
                  )}
                  placeholder="장소를 입력해주세요"
                />
              </div>
            </div>
          </div>
          {updatedAppointment.status !== AppointmentStatus.SCHEDULED && (
            <div className="mt-4">
              <h4 className="font-semibold mb-1">만남후기 작성</h4>
              <Textarea
                rows={5}
                placeholder="후기를 입력해 주세요."
                value={updatedAppointment.review}
                onChange={handleReviewChange}
              />
            </div>
          )}
        </div>
        <DialogFooter className="mt-2">
          <Button type="submit" onClick={handleSaveChanges}>
            저장하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAppointment;
