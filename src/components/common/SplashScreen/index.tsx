'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const images = [
  '/images/bgImage_001.webp',
  '/images/bgImage_002.webp',
  '/images/bgImage_003.webp',
  '/images/bgImage_004.webp',
  '/images/bgImage_005.webp',
  '/images/bgImage_006.webp',
];

export default function SplashScreen({ isLoading }: { isLoading: boolean }) {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // 클라이언트 사이드에서만 랜덤 이미지 선택
    setSelectedImage(images[Math.floor(Math.random() * images.length)]);

    if (!isLoading) {
      setTimeout(() => setIsVisible(false), 500); // 0.5초 후 페이드아웃
    }
  }, [isLoading]);

  if (!isVisible || !selectedImage) return null; // 초기에는 렌더링하지 않음

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-white transition-opacity duration-500 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Image
        src={selectedImage}
        alt="로딩중..."
        width={500}
        height={500}
        priority
      />
    </div>
  );
}
