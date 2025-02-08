'use client';

import BottomTab from '@/components/common/BottomTab';
import { useAuthCheck } from '@/hooks/useAuthCheck';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useAuthCheck();

  return (
    <div className="min-h-svh w-full">
      {children}
      <BottomTab />
    </div>
  );
}
