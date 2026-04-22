'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { allClearPersistStore, asyncFn, getAccessToken } from '@/lib/utils';
import { useLoginService } from '@/service';

const KakaoLogoutRedirect = () => {
  const router = useRouter();
  const { useKakaoLogout } = useLoginService();

  const { mutateAsync: kakaoLogoutAsync, isPending } = useKakaoLogout();

  const callbackKakaoLogout = async () => {
    const accessToken = getAccessToken();

    const [error] = await asyncFn(kakaoLogoutAsync({ accessToken }), '');
    if (!error) {
      toast.success('로그아웃 되었습니다.');
    }
    allClearPersistStore();
    router.push('/');
  };

  useEffect(() => {
    callbackKakaoLogout();
  }, []);

  return isPending && <p className="mt-[150px] text-lg">Kakao Logout Redirecting...</p>;
};

export default KakaoLogoutRedirect;
