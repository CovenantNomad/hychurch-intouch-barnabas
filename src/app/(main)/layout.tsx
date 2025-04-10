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
    <div className="min-h-svh h-svh flex flex-col">
      {children}
      <BottomTab />
    </div>
  );
}
