'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

const MainHeader = () => {
  const [isOpen, setIsOpen] = useState<boolean>(() => false);
  return (
    <div
      className={`h-16 flex items-center ${
        !isOpen && 'justify-end'
      } px-6 border-b border-gray-200`}
    >
      {isOpen ? (
        <div className="w-full flex items-center space-x-2">
          <Input
            className="text-sm"
            placeholder="죄송해요ㅠ 개발중이예요!"
            disabled
          />
          <Button
            variant={'ghost'}
            onClick={() => setIsOpen(false)}
            className="px-3 py-1 text-sm"
          >
            취소
          </Button>
        </div>
      ) : (
        <Button
          variant={'ghost'}
          onClick={() => setIsOpen(true)}
          className="w-7 h-7 py-0"
        >
          <SearchIcon />
        </Button>
      )}
    </div>
  );
};

export default MainHeader;
