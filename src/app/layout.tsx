import type { Metadata } from 'next';

import '@/app/globals.css';

import localFont from 'next/font/local';

// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import GlobalAlert from '@/components/common/GlobalAlert';
import GlobalLoading from '@/components/common/GlobalLoading';
import { RouterWrapper } from '@/components/common/RouterWrapper';
import RootPageTransition from '@/components/layout/RootPageTransition';
import { Toaster } from '@/components/ui/sonner';
import ReactQueryProvider from '@/providers/ReactQueryProvider';

export const metadata: Metadata = {
  title: 'Social Login Web',
  description: 'Social Login Web Application',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SocialLogin',
  },
  formatDetection: {
    telephone: false,
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

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <RouterWrapper>
      <html lang="ko" className={pretendard.variable}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        </head>
        <body className="min-h-dvh flex flex-col">
          <ReactQueryProvider>
            <RootPageTransition>{children}</RootPageTransition>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            <GlobalAlert />
            <Toaster />
            <GlobalLoading />
          </ReactQueryProvider>
        </body>
      </html>
    </RouterWrapper>
  );
}
