import { MapPinnedIcon } from 'lucide-react';

export const LocationDisplay = ({ place }: { place: string }) => (
  <div className="flex justify-end items-center space-x-2">
    <MapPinnedIcon className="h-4 w-4" />
    <span className="text-sm">{place}</span>
  </div>
);
