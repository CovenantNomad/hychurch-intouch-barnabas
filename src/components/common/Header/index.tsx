'use client';

import { ReactNode } from 'react';
import BackButton from './_components/BackButton';

type Props = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
};

const Header = ({ left, center, right }: Props) => {
  return (
    <div className={`h-16 flex items-center border-b border-gray-200 px-6`}>
      {/* 왼쪽 섹션 */}
      <div className="flex-1 flex justify-start items-center">{left}</div>

      {/* 중앙 섹션 */}
      <div className="flex-1 flex justify-center items-center mx-4">
        {center}
      </div>

      {/* 오른쪽 섹션 */}
      <div className="flex-1 flex justify-end items-center">{right}</div>
    </div>
  );
};

Header.BackButton = BackButton;

export default Header;
