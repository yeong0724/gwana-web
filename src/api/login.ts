import { postAxios } from '@/lib/api';
import { delayAsync } from '@/lib/utils';
import type { ApiResponse, LoginResponse } from '@/types';

const getAccessTokenByKakaoCode = async <T>(params: T) => {
  await delayAsync(1000);
  return postAxios<ApiResponse<LoginResponse>>({
    url: '/user/callback',
    params,
  });
};

const refreshAccessToken = async <T>(params: T) => {
  return postAxios<ApiResponse<LoginResponse>>({
    url: '/user/refresh/token',
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
  return postAxios<ApiResponse<string>>({
    url: '/user/logout/kakao',
    params,
  });
};

export { getAccessTokenByKakaoCode, fetchLogin, refreshAccessToken, kakaoLogout };
