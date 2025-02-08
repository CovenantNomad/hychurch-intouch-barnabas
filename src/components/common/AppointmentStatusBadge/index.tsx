import { cn, getAppointmentMessage } from '@/lib/utils';
import { AppointmentStatus } from '@/types/barnabas.types';

type Props = {
  status: AppointmentStatus;
};

const AppointmentStatusBadge = ({ status }: Props) => {
  return (
    <span
      className={cn(
        'py-1 px-2 rounded-full text-white text-xs',
        status === AppointmentStatus.SCHEDULED && 'bg-emerald-500',
        status === AppointmentStatus.COMPLETED && 'bg-blue-500',
        status === AppointmentStatus.CANCELED && 'bg-amber-500'
      )}
    >
      {getAppointmentMessage(status)}
    </span>
  );
};

export default AppointmentStatusBadge;
