import { Clock3Icon } from 'lucide-react';

export const TimeDisplay = ({
  hour,
  minute,
  isLeft,
}: {
  hour: string;
  minute: string;
  isLeft?: boolean;
}) => (
  <div
    className={`flex ${
      isLeft ? 'justify-start' : 'justify-end'
    } items-center space-x-2`}
  >
    <Clock3Icon className="h-4 w-4" />
    <span className="text-sm">
      {hour}:{minute}
    </span>
  </div>
);
