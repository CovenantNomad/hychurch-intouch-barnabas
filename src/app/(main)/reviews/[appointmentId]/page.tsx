'use client';

import Header from '@/components/common/Header';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  getAppointmentById,
  updateAppointmentReview,
} from '@/repositories/barnabas';
import { TAppointment } from '@/types/barnabas.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ReviewPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();
  const [review, setReview] = useState('');

  const appointmentId =
    typeof params?.appointmentId === 'string'
      ? params.appointmentId
      : undefined;

  const { data: appointment, isLoading } = useQuery<TAppointment | null>({
    queryKey: [`getReviews`, appointmentId],
    queryFn: () => {
      if (!appointmentId) throw new Error('Invalid appointmentId');
      return getAppointmentById(appointmentId);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!appointmentId,
  });

  const reviewMutation = useMutation({
    mutationFn: ({
      appointmentId,
      review,
    }: {
      appointmentId: string;
      review: string;
    }) => updateAppointmentReview(appointmentId, review), // TAppointment 타입 데이터 전달

    onSuccess: () => {
      toast({
        title: '✅ 만남 후기 작성 성공',
        description: `만남 후기가 업데이트 되었습니다.`,
      });
      queryClient.invalidateQueries({
        queryKey: ['getAppointmentDetails'],
      });
      queryClient.invalidateQueries({
        queryKey: ['findProgressMentorships'],
      });
      queryClient.invalidateQueries({
        queryKey: [`getReviews`, appointmentId],
      });
    },

    onError: (error) => {
      toast({
        title: '❗️만남 후기 작성 실패',
        description:
          error instanceof Error ? error.message : '알 수 없는 오류입니다.',
      });
    },
  });

  const onSavehandler = () => {
    if (!appointmentId) return;
    reviewMutation.mutate({ appointmentId, review });
  };

  useEffect(() => {
    if (appointment?.review) {
      setReview(appointment.review);
    }
  }, [appointment]);

  return (
    <>
      <Header
        left={<Header.BackButton />}
        center={<div>만남 후기 작성</div>}
        right={
          <Button
            variant={'ghost'}
            onClick={onSavehandler}
            disabled={
              !appointmentId || review == '' || reviewMutation.isPending
            }
          >
            {reviewMutation.isPending ? '저장중...' : '저장'}
          </Button>
        }
      />
      {/* 기존 컨테이너 보다 좌우여백 8px 축소 */}
      <div className="flex-1 px-4 pt-6 pb-20 overflow-y-auto">
        {!appointmentId ? (
          <div className="h-screen flex flex-col justify-center items-center">
            <h1 className="py-1">올바른 접근이 아닙니다.</h1>
            <Button onClick={() => router.push('/')} className="mt-2">
              첫화면으로
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-60 text-gray-500 text-sm">
            <span className="animate-pulse">
              리뷰 정보를 불러오는 중입니다...
            </span>
          </div>
        ) : appointment ? (
          <div className="flex flex-col h-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              멘티: {appointment.menteeName} ({appointment.week}주차 만남)
            </h2>
            <div className="flex-1">
              <textarea
                id="review-textarea"
                className={cn(
                  'w-full h-full text-base resize-none pt-2 pb-12 bg-transparent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-zinc-400 placeholder:text-sm'
                )}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder={`(작성 가이드)\n멘티의 기도제목, 영적상태 그리고 중요했던 나눔 내용들을\n작성해주세요.`}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">데이터가 없습니다.</div>
        )}
      </div>
    </>
  );
};

export default ReviewPage;
