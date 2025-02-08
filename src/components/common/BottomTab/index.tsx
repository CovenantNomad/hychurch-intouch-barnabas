import Link from 'next/link';

const BottomTab = () => {
  return (
    <div className="w-full max-w-[600px] h-[80px] fixed bottom-0 left-0 right-0 mx-auto z-10">
      <ul className="w-full h-full flex justify-between pt-4 bg-white border-t border-gray-100">
        <Link href={'/barnabas'} className="w-full cursor-pointer">
          <li className="flex flex-col items-center space-y-1">
            <span className="text-sm">진행과정</span>
          </li>
        </Link>
        <Link href={'/'} className="w-full cursor-pointer">
          <li className="flex flex-col items-center space-y-1">
            <span className="text-sm">캘린더</span>
          </li>
        </Link>
        <Link href={'/profile'} className="w-full cursor-pointer">
          <li className="flex flex-col items-center space-y-1">
            <span className="text-sm">마이페이지</span>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default BottomTab;
