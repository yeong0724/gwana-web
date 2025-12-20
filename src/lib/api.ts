import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { get, isEmpty } from 'lodash-es';
import { toast } from 'sonner';

import { allClearPersistStore } from '@/lib/utils';
import { alertStore } from '@/stores/useAlertStore';
import { loginActions } from '@/stores/useLoginStore';
import { ResultCode } from '@/types';
import { HttpMethod } from '@/types/api';

// const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${process.env.NEXT_PUBLIC_API_PREFIX}/${process.env.NEXT_PUBLIC_API_VERSION}`;

// API 인스턴스 생성
const axiosOption = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const basicInstance: AxiosInstance = axios.create(axiosOption);

const instance: AxiosInstance = axios.create(axiosOption);

// 요청 인터셉터 - Bearer 토큰 자동 설정
instance.interceptors.request.use(
  async (config) => {
    const { accessToken } = loginActions.getLoginInfo();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
instance.interceptors.response.use(
  async (response: AxiosResponse) => {
    /**
     * HttpStatus.OK (200)
     * HttpStatus.CREATED (201)
     */

    // await delayAsync();
    return response.data;
  },
  async (error) => {
    const errorResponse = get(error, 'response', {});
    if (isEmpty(errorResponse)) {
      throw get(error, 'message', '');
    }

    const { status, data } = errorResponse;

    if (status === 401) {
      if (data.code === ResultCode.UNAUTHORIZED) {
        const { accessToken } = loginActions.getLoginInfo();

        try {
          const { data } = await basicInstance.post('/user/refresh/token', { accessToken });
          const code = get(data, 'code', '');
          const newAccessToken = get(data, 'data', '');

          if (code === '0000') {
            loginActions.setLoginInfo({ accessToken: newAccessToken, isLogin: true });

            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            return instance(error.config);
          } else {
            allClearPersistStore();
            toast.error(data.message);
            window.location.href = '/';
            throw error;
          }
        } catch (refreshTokenError) {
          allClearPersistStore();
          throw refreshTokenError;
        }
      } else if (data.code === ResultCode.INVALID || data.code === ResultCode.FORBIDDEN) {
        allClearPersistStore();
        await alertStore.getState().showConfirmAlert({
          title: '알림',
          description: data.message,
          size: 'sm',
        });
        window.location.href = '/';
        throw error;
      }
    }

    throw error;
  }
);

// API 요청 옵션 타입
interface ApiRequestOptions {
  method: HttpMethod;
  url: string;
  params?: unknown;
  headers?: Record<string, string>;
}

// 통합 API 통신 함수
export const apiClient = <T>({
  method,
  url,
  params: data,
  headers = {},
}: ApiRequestOptions): Promise<T> => {
  const config: AxiosRequestConfig = {
    method,
    url,
    headers,
  };

  try {
    switch (method) {
      case HttpMethod.GET:
      case HttpMethod.DELETE:
        return instance(config);
      case HttpMethod.POST:
      case HttpMethod.PUT:
      case HttpMethod.PATCH:
        return instance({
          ...config,
          data,
        });
    }
  } catch (error) {
    throw error;
  }
};

type AxiosOptions = {
  url: string;
  params: unknown;
};

export const postAxios = <T>({ url, params }: AxiosOptions): Promise<T> => {
  return apiClient<T>({
    method: HttpMethod.POST,
    url,
    params,
  });
};

export const getAxios = <T>({ url }: Omit<AxiosOptions, 'params'>): Promise<T> => {
  return apiClient<T>({
    method: HttpMethod.GET,
    url,
  });
};

export default instance;
