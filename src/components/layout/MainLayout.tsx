'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { toast } from 'sonner';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header/MainHeader';
import SubHeader from '@/components/layout/Header/SubHeader';
import { menuGroup } from '@/constants';
import {
  allClearPersistStore,
  clearLoginInfo,
  cn,
  getAccessToken,
  noMainHeaderPage,
  renewLoginInfo,
} from '@/lib/utils';
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
  const { showConfirmAlert } = useAlertStore();
  const { useRefreshAccessToken } = useLoginService();
  const { mutate: refreshAccessToken } = useRefreshAccessToken();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const validateAuthorization = () => {
    const accessToken = getAccessToken();

    /**
     * 토큰이 없다면 검증 미진행
     * - 비로그인 상태에서 새로고침 일수도 있으니 cart store reset은 skip
     */
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
            allClearPersistStore();
            if (pathname.startsWith('/mypage') || pathname.startsWith('/payment')) {
              toast.info(message || '');
              router.push('/');
            }
          }
        },
        onError: async () => {
          await showConfirmAlert({
            title: '에러',
            description: '로그인 정보갱신에 실패하였습니다.',
          });

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
      <SubHeader />
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
