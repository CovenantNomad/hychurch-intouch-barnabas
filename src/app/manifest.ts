import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '바나바',
    short_name: '바나바',
    description: '인터치 청년교회 바나바 과정을 위한 웹서비스',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#18181B',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
