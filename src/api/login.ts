import { postAxios } from '@/lib/api';
import { delayAsync } from '@/lib/utils';
import type { ApiResponse, LoginResponse } from '@/types';

const getAccessTokenByKakaoCode = async <T>(params: T) => {
  await delayAsync(1000);
  return postAxios<ApiResponse<LoginResponse>>({
    url: '/auth/kakao/login',
    params,
  });
};

const refreshAccessToken = async <T>(params: T) => {
  // Refresh Token 은 HttpOnly 쿠키로 전송된다(withCredentials). 본문은 사용하지 않는다.
  return postAxios<ApiResponse<LoginResponse>>({
    url: '/auth/token/refresh',
    params,
  });
};

const fetchLogin = async <T, V>(params: V) => {
  return postAxios<T>({
    url: '/user/signin',
    params,
  });
};

const kakaoLogout = async <T>(params: T) => {
  // 로그아웃 대상 사용자는 Bearer Access Token 으로 식별된다(요청 인터셉터가 자동 첨부).
  return postAxios<ApiResponse<void>>({
    url: '/auth/logout',
    params,
  });
};

export { getAccessTokenByKakaoCode, fetchLogin, refreshAccessToken, kakaoLogout };
