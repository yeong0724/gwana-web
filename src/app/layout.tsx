import '@/app/globals.css';

import type { Metadata } from 'next';
import {
  Cormorant_Garamond,
  EB_Garamond,
  Libre_Baskerville,
  Playfair_Display,
} from 'next/font/google';
import localFont from 'next/font/local';

import { GlobalAlert, GlobalLoading } from '@/components/common/global';
import KakaoScript from '@/components/script/KakaoScript';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Toaster } from '@/components/ui/sonner';
import ReactQueryProvider from '@/providers/ReactQueryProvider';

export const metadata: Metadata = {
  title: 'Gwana Tea House',
  description: 'Gwana Tea House',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Gwana',
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const pretendard = localFont({
  src: '../static/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

// Google Fonts - Serif 폰트들
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-eb-garamond',
  display: 'swap',
});

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-libre-baskerville',
  display: 'swap',
});

export default function Layout({ children }: RootLayoutProps) {
  const fontVariables = [
    pretendard.variable,
    cormorantGaramond.variable,
    playfairDisplay.variable,
    ebGaramond.variable,
    libreBaskerville.variable,
  ].join(' ');

  return (
    <html lang="en" className={fontVariables}>
      <head>
        <link rel="apple-touch-icon" href="/images/gwana_logo-192x192.webp" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-dvh flex flex-col">
        <ReactQueryProvider>
          {children}
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <GlobalAlert />
          <Toaster />
          <GlobalLoading />
          <KakaoScript />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
