import { cn } from '@/lib/utils';

const bgColors = [
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-rose-500',
  'bg-pink-500',
];

const ColorBar = ({ index }: { index: number }) => {
  return (
    <div
      className={cn(
        'w-1 h-[50px] rounded-full mr-2',
        bgColors[Math.floor(index * bgColors.length)]
      )}
    />
  );
};

export default ColorBar;
