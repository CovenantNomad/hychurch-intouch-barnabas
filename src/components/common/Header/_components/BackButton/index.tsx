'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();
  return (
    <Button variant={'ghost'} onClick={() => router.back()}>
      <ChevronLeftIcon className="h-8 w-8" /> 뒤로
    </Button>
  );
};

export default BackButton;
