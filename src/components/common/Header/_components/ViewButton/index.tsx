'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type Props = {
  text: string;
  path: string;
};

const ViewButton = ({ text, path }: Props) => {
  const router = useRouter();
  return (
    <Button
      variant={'ghost'}
      onClick={() => router.push(path)}
      className="-ml-2"
    >
      {text}
    </Button>
  );
};

export default ViewButton;
