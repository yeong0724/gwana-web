'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { CustomHeader } from '@/components/common';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { menuGroup } from '@/constants';
import { refreshAccessTokenSingleton } from '@/lib/tokenManager';
import { allClearPersistStore, cn, noMainHeaderPage, validateToken } from '@/lib/utils';
import { useLoginStore } from '@/stores';
import { initailState } from '@/stores/useLoginStore';

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const pathname = usePathname();
  const isNoMainHeaderPage = noMainHeaderPage(pathname);
  const { setLoginInfo, loginInfo, _hasHydrated } = useLoginStore();

  const onCheckLoginStatus = async () => {
    const { accessToken } = loginInfo;

    if (!accessToken) {
      setLoginInfo(initailState);
      return;
    }

    // Access Token이 아직 유효한 경우
    if (validateToken(accessToken)) {
      setLoginInfo(loginInfo);
      return;
    }

    // Access Token 만료 시 갱신 시도
    try {
      await refreshAccessTokenSingleton();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      allClearPersistStore();
    }
  };

  useEffect(() => {
    if (_hasHydrated) onCheckLoginStatus();
  }, [_hasHydrated]);

  return isNoMainHeaderPage ? (
    <div className="h-dvh bg-gray-50 flex flex-col relative overflow-hidden">
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
