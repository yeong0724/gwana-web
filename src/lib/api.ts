import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { get } from 'lodash-es';

import { allClearPersistStore, getAccessToken } from '@/lib/utils';
import { alertStore } from '@/stores/useAlertStore';
import { HttpMethod } from '@/types';

// API 인스턴스 생성
const axiosOption = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 5 * 60 * 1000, // 5분
  headers: {
    'Content-Type': 'application/json',
  },
};

export const basicInstance: AxiosInstance = axios.create(axiosOption);

const instance: AxiosInstance = axios.create(axiosOption);

// 요청 인터셉터 - Bearer 토큰 자동 설정
instance.interceptors.request.use(
  async (config) => {
    const accessToken = getAccessToken();

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
    const status = get(error, 'response.status', {});

    let description = get(error, 'message', '');
    if (status === 401 || status === 403) {
      description = '로그인이 만료되었습니다. 로그인 후 이용해주세요.';
      await alertStore.getState().showConfirmAlert({
        title: '알림',
        description,
        size: 'sm',
      });

      allClearPersistStore();
      window.location.href = '/';
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
  headers?: Record<string, string>;
};

export const postAxios = <T>({ url, params, headers }: AxiosOptions): Promise<T> => {
  return apiClient<T>({
    method: HttpMethod.POST,
    url,
    params,
    headers,
  });
};

export const getAxios = <T>({ url }: Omit<AxiosOptions, 'params'>): Promise<T> => {
  return apiClient<T>({
    method: HttpMethod.GET,
    url,
  });
};

export default instance;
