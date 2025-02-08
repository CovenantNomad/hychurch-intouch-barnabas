import { groupAndSortDailyAppointments } from '@/lib/utils';
import { useDateStore } from '@/stores/dateStore';
import { TAppointment } from '@/types/barnabas.types';
import dayjs from 'dayjs';
import AppointmentAccordion from './_components/AppointmentAccordion';

type Props = {
  appointments: TAppointment[];
};

const AppointmentList = ({ appointments }: Props) => {
  const { selectedDate } = useDateStore();

  const sortedAppointments = groupAndSortDailyAppointments(appointments);

  return (
    <>
      <h4 className="px-8 pt-6 pb-4">
        {dayjs(selectedDate)?.format('YYYY. MM. DD.')}{' '}
        <span className="inline-block ml-2 text-sm tracking-wide">
          {appointments.length !== 0 && `(전체일정: ${appointments.length}개)`}
        </span>
      </h4>
      <div>
        {appointments.length !== 0 ? (
          <AppointmentAccordion sortedAppointments={sortedAppointments} />
        ) : (
          <div className="h-40 flex items-center justify-center px-8 py-4">
            <span className="text-lg font-semibold">일정 없음</span>
          </div>
        )}
      </div>
    </>
  );
};

export default AppointmentList;
