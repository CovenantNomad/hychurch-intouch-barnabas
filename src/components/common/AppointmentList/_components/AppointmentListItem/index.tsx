'use client';

import { LocationDisplay } from '@/components/common/AppointmentDisplay/LocationDisplay';
import { TimeDisplay } from '@/components/common/AppointmentDisplay/TimeDisplay';
import ColorBar from '@/components/common/ColorBar';
import UpdateAppointment from '@/components/common/UpdateAppointment';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authState';
import {
  AppointmentStatus,
  TAppointment,
  TMatchingStatus,
} from '@/types/barnabas.types';
import { EditIcon, Settings2Icon } from 'lucide-react';
import Link from 'next/link';

type Props = {
  appointment: TAppointment;
  index: number;
};

const AppointmentListItem = ({ appointment, index }: Props) => {
  const { profile } = useAuthStore();

  return (
    <div className="flex items-center py-3 text-sm mt-2">
      {/* 컬러 바 표시 */}
      <ColorBar index={index} status={appointment.status} />
      {/* 일정 정보 */}
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="inline-block">{appointment.barnabaName}</span>
          <div className="w-[1px] h-3 bg-gray-300" />
          <span>{appointment.menteeName}</span>
        </div>
        <div className="flex items-center space-x-3">
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
      {profile?.id === appointment.barnabaId &&
        appointment.matchingStatus !== TMatchingStatus.COMPLETED &&
        appointment.matchingStatus !== TMatchingStatus.FAILED && (
          <div className="ml-4">
            {appointment.status !== AppointmentStatus.COMPLETED ? (
              <UpdateAppointment
                appointment={appointment}
                triggerComponent={
                  <Button variant={'outline'}>
                    <Settings2Icon />
                  </Button>
                }
              />
            ) : (
              <Link href={`/reviews/${appointment.appointmentId}`}>
                <Button variant={'outline'}>
                  <EditIcon />
                </Button>
              </Link>
            )}
          </div>
        )}
    </div>
  );
};

export default AppointmentListItem;
