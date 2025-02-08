import { CalendarIcon } from 'lucide-react';

export const DateDisplay = ({ date }: { date: string }) => (
  <div className="flex items-center space-x-2">
    <CalendarIcon className="h-4 w-4" />
    <span className="text-sm">{date}</span>
  </div>
);
