import { MapPinnedIcon } from 'lucide-react';

export const LocationDisplay = ({
  place,
  isLeft,
}: {
  place: string;
  isLeft?: boolean;
}) => (
  <div
    className={`flex ${
      isLeft ? 'justify-start' : 'justify-end'
    } items-center space-x-2`}
  >
    <MapPinnedIcon className="h-4 w-4" />
    <span className="text-sm">{place}</span>
  </div>
);
