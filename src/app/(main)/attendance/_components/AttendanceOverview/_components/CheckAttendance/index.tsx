'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { serviceList } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { createMenteeAttendance } from '@/repositories/barnabas';
import { TMatching, TMenteeAttendance } from '@/types/barnabas.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { SquareCheckBigIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

type Props = {
  course: TMatching;
  sunday: string;
};

const CheckAttendance = ({ sunday, course }: Props) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [attendanceService, setAttendanceService] = useState<string>('');
  const [online, setIsOnline] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');

  const generateServiceText = useMemo(() => {
    if (attendanceService === '미참석') return attendanceService;
    return `${attendanceService} (${online ? '온라인' : '성전'})`;
  }, [attendanceService, online]);

  const resetForm = () => {
    setAttendanceService('');
    setIsOnline(false);
    setDescription('');
  };

  const mutation = useMutation({
    mutationFn: (data: TMenteeAttendance) => createMenteeAttendance(data),
    onSuccess: (data) => {
      toast({
        title: '✅ 출석체크 성공',
        description: `${dayjs(data.date).format(
          'YYYY. MM. DD.'
        )} 출석체크가 제출되었습니다.`,
      });
      queryClient.invalidateQueries({
        queryKey: ['checkAttendanceSubmit', sunday, course.menteeId],
      });
      resetForm();
      setIsOpen(false);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류입니다.';
      toast({
        title: '❗️출석체크 실패',
        description: errorMessage,
      });
    },
  });

  const onSubmitHandler = () => {
    if (!course) {
      return toast({
        title: '❗️오류',
        description:
          '잘못된 접근입니다. 진행과정에서 바나바 과정을 선택해주세요.',
        variant: 'destructive',
      });
    }

    const submitData: TMenteeAttendance = {
      date: sunday,
      barnabaId: course.barnabaId,
      barnabaName: course.barnabaName,
      menteeId: course.menteeId,
      menteeName: course.menteeName,
      service: generateServiceText,
      description: description,
    };

    mutation.mutate(submitData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className="p-2 -mr-2">
          예배출석 <SquareCheckBigIcon className="h-8 w-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] max-w-[96%] overflow-y-auto mx-auto px-4">
        <DialogHeader>
          <DialogTitle>예배 출석체크</DialogTitle>
          <DialogDescription>
            멘티들의 이번주 예배 출석을 제출해주세요
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h6 className="text-base font-medium mb-1">예배선택</h6>
          <div className="grid grid-cols-3 gap-4">
            {serviceList.map((service) => (
              <div key={service.id}>
                <Button
                  variant={'outline'}
                  className="w-full"
                  onClick={() => setAttendanceService(service.value)}
                >
                  {service.name}
                </Button>
              </div>
            ))}
          </div>
          <div className="w-full flex items-center mt-4 py-1">
            <h6 className="flex-1 text-base font-medium mb-1">출석내용</h6>
            <div className="border-b pb-0.5 px-2 text-sm">
              {attendanceService || '예배를 선택해주세요'}
            </div>
            {attendanceService !== '' && attendanceService !== '미참석' && (
              <div className="flex items-center ml-4 pb-0.5">
                <Switch checked={online} onCheckedChange={setIsOnline} />
                <Label htmlFor="online-check" className="ml-2">
                  온라인
                </Label>
              </div>
            )}
          </div>
          <div className="mt-3">
            <h6 className="text-base font-medium mb-1">비고</h6>
            <Input
              className="text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="mt-2">
          <div className="flex flex-col space-y-2">
            <Button onClick={onSubmitHandler}>제출</Button>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsOpen(false);
              }}
            >
              취소
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckAttendance;
