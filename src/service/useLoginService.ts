import { useMutation } from '@tanstack/react-query';

import { getAccessTokenByKakaoCode, kakaoLogout, refreshAccessToken } from '@/api/login';
import {
  GetAccessTokenByKakaoCodeRequest,
  KakaoLogoutRequest,
  RefreshAccessTokenRequest,
  UseMutationCustomOptions,
} from '@/types';

const useLoginService = () => {
  /**
   * Access Token 재발급
   */
  const useRefreshAccessToken = (options?: UseMutationCustomOptions) =>
    useMutation({
      mutationKey: ['refreshAccessToken'],
      mutationFn: (param: RefreshAccessTokenRequest) => refreshAccessToken(param),
      ...options,
    });

  /**
   * Kakao 기반 Access Token 발급
   */
  const useGetAccessTokenByKakaoCode = (options?: UseMutationCustomOptions) =>
    useMutation({
      mutationFn: (param: GetAccessTokenByKakaoCodeRequest) => getAccessTokenByKakaoCode(param),
      ...options,
    });

  /**
   * Kakao 로그아웃
   */
  const useKakaoLogout = (options?: UseMutationCustomOptions) =>
    useMutation({
      mutationFn: (param: KakaoLogoutRequest) => kakaoLogout(param),
      ...options,
    });

  return { useGetAccessTokenByKakaoCode, useRefreshAccessToken, useKakaoLogout };
};

export default useLoginService;
