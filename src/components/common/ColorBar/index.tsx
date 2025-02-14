import { cn } from '@/lib/utils';
import { AppointmentStatus } from '@/types/barnabas.types';

const statusColors = {
  [AppointmentStatus.COMPLETED]: [
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
  ],
  [AppointmentStatus.SCHEDULED]: [
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-emerald-500',
    'bg-teal-500',
  ],
  [AppointmentStatus.CANCELED]: [
    'bg-fuchsia-500',
    'bg-rose-500',
    'bg-pink-500',
  ],
};

const getStatusColor = (status: AppointmentStatus, index: number) => {
  const colors =
    statusColors[status] || statusColors[AppointmentStatus.SCHEDULED];
  const hash = index % colors.length; // 배열 길이 넘으면 반복
  return colors[hash];
};

const ColorBar = ({
  index,
  status,
}: {
  index: number;
  status: AppointmentStatus;
}) => {
  return (
    <div
      className={cn(
        'w-1 h-[50px] rounded-full mr-2',
        getStatusColor(status, index)
      )}
    />
  );
};

export default ColorBar;
