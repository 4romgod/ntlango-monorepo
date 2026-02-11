import localFont from 'next/font/local';

export const plusJakarta = localFont({
  src: [
    {
      path: '../../public/fonts/plus-jakarta-sans-latin.woff2',
      weight: '400 700',
      style: 'normal',
    },
  ],
  display: 'swap',
  fallback: ['Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
});

export const spaceGrotesk = localFont({
  src: [
    {
      path: '../../public/fonts/space-grotesk-latin.woff2',
      weight: '500 700',
      style: 'normal',
    },
  ],
  display: 'swap',
  fallback: ['Avenir Next', 'Segoe UI', 'Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
});
