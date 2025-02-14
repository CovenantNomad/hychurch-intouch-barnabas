'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TAppointment } from '@/types/barnabas.types';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Settings2Icon } from 'lucide-react';
import Link from 'next/link';

type Props = {
  refetch?: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<TAppointment[], Error>>;
};

const ViewButton = ({ refetch }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="-mr-2">
          <Settings2Icon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 mr-6">
        {refetch && (
          <>
            <DropdownMenuItem onClick={() => refetch()}>
              일정 동기화
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <Link href={'/'}>
          <DropdownMenuItem>전체 일정 보기</DropdownMenuItem>
        </Link>
        <Link href={'/my-schedule'}>
          <DropdownMenuItem>내 일정만 보기</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewButton;
