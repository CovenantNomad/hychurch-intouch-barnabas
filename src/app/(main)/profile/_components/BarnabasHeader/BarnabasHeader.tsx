'use client';

import { useAuthStore } from '@/stores/authState';

const BarnabasHeader = () => {
  const { profile } = useAuthStore();

  return (
    <div className="flex flex-col">
      <span className="text-sm mb-1">바나바 {profile?.cohort || 0}기</span>
      <span className="text-2xl font-semibold">
        {profile?.name + ' 바나바님' || '알수없음'} 👋🏻
      </span>
    </div>
  );
};

export default BarnabasHeader;
