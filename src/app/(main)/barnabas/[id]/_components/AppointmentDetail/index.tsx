import { DateDisplay } from '@/components/common/AppointmentDisplay/DateDisplay';
import { LocationDisplay } from '@/components/common/AppointmentDisplay/LocationDisplay';
import { TimeDisplay } from '@/components/common/AppointmentDisplay/TimeDisplay';
import AppointmentStatusBadge from '@/components/common/AppointmentStatusBadge';
import UpdateAppointment from '@/components/common/UpdateAppointment';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getAppointmentDetails } from '@/repositories/barnabas';
import { useMatchingStore } from '@/stores/matchingState';
import { useQuery } from '@tanstack/react-query';
import { MessageSquareXIcon, RotateCcwIcon } from 'lucide-react';

const AppointmentDetail = () => {
  const selectedMatching = useMatchingStore((state) => state.selectedMatching);

  const { isLoading, isFetching, data, refetch } = useQuery({
    queryKey: ['getAppointmentDetails', selectedMatching!.id],
    queryFn: () => getAppointmentDetails(selectedMatching!.id),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!selectedMatching,
  });

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">세부일정</h4>
        <div className="flex items-center space-x-2">
          {isFetching && (
            <span className="text-xs text-gray-300">새로고침 중...</span>
          )}
          <Button size={'sm'} variant={'ghost'} onClick={() => refetch()}>
            <RotateCcwIcon />
          </Button>
        </div>
      </div>
      <div className="py-4 mx-auto">
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : data && data.length !== 0 ? (
          data
            .slice() // 원본 배열을 변경하지 않도록 복사
            .sort((a, b) => Number(a.week) - Number(b.week)) // week 기준 오름차순 정렬
            .map((appointment) => (
              <div
                key={appointment.week}
                className="border rounded-lg bg-white mb-3"
              >
                <div className="flex justify-between items-center border-b px-4 pt-2 pb-1">
                  <p className="text-lg font-semibold">
                    {appointment.week}주차과정
                  </p>
                  <AppointmentStatusBadge status={appointment.status} />
                </div>
                <div className="px-4 py-4 flex justify-between items-end">
                  <div className="text-gray-500 space-y-2">
                    <DateDisplay date={appointment.date} />
                    <TimeDisplay
                      hour={appointment.hour}
                      minute={appointment.minute}
                    />
                    <LocationDisplay place={appointment.place} />
                  </div>
                  <UpdateAppointment
                    appointment={appointment}
                    triggerComponent={
                      <Button className="rounded-full">자세히 보기</Button>
                    }
                  />
                </div>
              </div>
            ))
        ) : (
          <div className="h-[200px] flex flex-col justify-center items-center border rounded-lg">
            <MessageSquareXIcon className="h-6 w-6" />
            <span className="text-sm mt-2">
              약속 되어 있는 만남 일정이 없습니다.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetail;
