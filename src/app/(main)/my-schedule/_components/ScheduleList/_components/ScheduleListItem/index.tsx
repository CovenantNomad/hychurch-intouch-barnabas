'use client';

import { LocationDisplay } from '@/components/common/AppointmentDisplay/LocationDisplay';
import { TimeDisplay } from '@/components/common/AppointmentDisplay/TimeDisplay';
import ColorBar from '@/components/common/ColorBar';
import UpdateAppointment from '@/components/common/UpdateAppointment';
import { Button } from '@/components/ui/button';
import { getDayOfWeek } from '@/lib/utils';
import { useAuthStore } from '@/stores/authState';
import { TAppointment } from '@/types/barnabas.types';
import { EditIcon } from 'lucide-react';

type Props = {
  appointment: TAppointment;
  index: number;
};

const ScheduleListItem = ({ appointment, index }: Props) => {
  const { profile } = useAuthStore();

  return (
    <div className="flex items-center py-3 text-sm mt-2">
      {/* 컬러 바 표시 */}
      <ColorBar index={index} />

      {/* 일정 정보 */}
      <div className="flex-1">
        <div className="">
          <span className="text-xl font-semibold">
            {appointment.date} ({getDayOfWeek(appointment.date)})
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span>{appointment.menteeName}</span>
          <span>
            ({appointment.week}주차 / {appointment.scheduledMeetingCount}주차)
          </span>
        </div>
      </div>

      {/* 시간 및 장소 */}
      <div className="text-right space-y-0.5">
        <TimeDisplay hour={appointment.hour} minute={appointment.minute} />
        <LocationDisplay place={appointment.place} />
      </div>
      {profile?.id === appointment.barnabaId && (
        <div className="ml-4">
          <UpdateAppointment
            appointment={appointment}
            triggerComponent={
              <Button variant={'outline'}>
                <EditIcon />
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
};

export default ScheduleListItem;
