'use client';

import { allClearPersistStore } from '@/lib/utils';
import { useLoginService } from '@/service';
import { useLoginStore } from '@/stores';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const KakaoLogoutRedirect = () => {
  const router = useRouter();
  const { accessToken } = useLoginStore();
  const { useKakaoLogout } = useLoginService();

  const { mutate: kakaoLogoutMutate, isPending } = useKakaoLogout();

  const callbackKakaoLogout = () => {
    kakaoLogoutMutate(
      { accessToken },
      {
        onSuccess: () => {
          allClearPersistStore();
          router.push('/');
        },
      }
    );
  };

  useEffect(() => callbackKakaoLogout(), []);

  return isPending && <p className="mt-[150px] text-lg">Kakao Logout Redirecting...</p>;
};

export default KakaoLogoutRedirect;
