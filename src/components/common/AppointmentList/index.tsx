import { Skeleton } from '@/components/ui/skeleton';
import { groupAndSortDailyAppointments } from '@/lib/utils';
import { useDateStore } from '@/stores/dateStore';
import { TAppointment } from '@/types/barnabas.types';
import dayjs from 'dayjs';
import AppointmentAccordion from './_components/AppointmentAccordion';

type Props = {
  appointments: TAppointment[];
  isLoading: boolean;
  isFetching: boolean;
};

const AppointmentList = ({ appointments, isLoading, isFetching }: Props) => {
  const { selectedDate } = useDateStore();

  const sortedAppointments = groupAndSortDailyAppointments(appointments);

  return (
    <div className="pt-6 pb-32">
      <h4 className="px-6 pb-4">
        {dayjs(selectedDate)?.format('YYYY. MM. DD.')}{' '}
        <span className="inline-block ml-2 text-sm tracking-wide">
          {appointments.length !== 0 && `(전체일정: ${appointments.length}개)`}
        </span>
      </h4>
      <div>
        {isLoading || isFetching ? (
          <div className="px-6 space-y-6">
            <Skeleton className="w-full h-7 pt-4 pb-1" />
            <Skeleton className="w-full h-7 pt-4 pb-1" />
            <Skeleton className="w-full h-7 pt-4 pb-1" />
          </div>
        ) : appointments.length !== 0 ? (
          <AppointmentAccordion sortedAppointments={sortedAppointments} />
        ) : (
          <div className="h-40 flex items-center justify-center px-6 py-4">
            <span className="text-lg font-semibold">일정 없음</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
