import type { Metadata } from 'next';

import '@/app/globals.css';

import localFont from 'next/font/local';

import { GlobalAlert, GlobalLoading } from '@/components/common';
import MainLayout from '@/components/layout/MainLayout';
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

export default function Layout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={pretendard.variable}>
      <head>
        <link rel="apple-touch-icon" href="/images/gwana_logo-192x192.webp" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-dvh flex flex-col">
        <ReactQueryProvider>
          {/* <TransitionsProvider>{children}</TransitionsProvider> */}
          <MainLayout>{children}</MainLayout>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <GlobalAlert />
          <Toaster />
          <GlobalLoading />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
