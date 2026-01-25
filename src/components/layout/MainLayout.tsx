'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { CustomHeader } from '@/components/common';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { menuGroup } from '@/constants';
import { allClearPersistStore, clearLoginInfo, cn, getAccessToken, noMainHeaderPage, renewLoginInfo } from '@/lib/utils';
import { useLoginService } from '@/service';
import { useAlertStore } from '@/stores';
import { ResultCode } from '@/types';

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const isNoMainHeaderPage = noMainHeaderPage(pathname);

  const { useRefreshAccessToken } = useLoginService();
  const { mutate: refreshAccessToken } = useRefreshAccessToken();

  const { showConfirmAlert } = useAlertStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const validateAuthorization = () => {
    const accessToken = getAccessToken();

    // 토큰이 없다면 검증 미진행
    if (!accessToken) {
      clearLoginInfo();
      return;
    }

    refreshAccessToken(
      { accessToken },
      {
        onSuccess: async ({ code, data, message }) => {
          if (code === ResultCode.SUCCESS) {
            renewLoginInfo(data);
          } else {
            await showConfirmAlert({ title: '알림', description: message || '' });
            allClearPersistStore();
            router.push('/');
          }
        },
        onError: () => {
          allClearPersistStore();
          router.push('/');
        },
      }
    );
  };

  useEffect(() => {
    validateAuthorization();

    intervalRef.current = setInterval(validateAuthorization, 25 * 1000 * 60);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return isNoMainHeaderPage ? (
    <div className="h-dvh  flex flex-col relative overflow-hidden bg-white">
      <CustomHeader />
      {children}
    </div>
  ) : (
    <div className={cn('flex flex-col', 'min-h-dvh')}>
      <Header menuGroup={menuGroup} />
      <main className={cn('flex-1', pathname === '/' && 'lg:mt-0')}>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
