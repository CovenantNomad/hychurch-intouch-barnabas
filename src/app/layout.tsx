import { Toaster } from '@/components/ui/toaster';
import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import Providers from './providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: '바나바 | 인터치 청년교회',
  description:
    '인터치 청년교회에서 이루어지는 바나바 과정을 위한 서비스입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body className={`bg-slate-50`}>
        <Providers>
          <main className="relative max-w-[600px] mx-auto overflow-hidden bg-white">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
