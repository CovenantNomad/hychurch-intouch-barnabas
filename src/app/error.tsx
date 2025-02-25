'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const RootError = () => {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="py-1">에러가 발생하였습니다</h1>
      <Button onClick={() => router.push('/')} className="mt-2">
        첫화면으로
      </Button>
    </div>
  );
};

export default RootError;
