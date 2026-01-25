import { clsx, type ClassValue } from 'clsx';
import { some, startsWith } from 'lodash-es';
import { twMerge } from 'tailwind-merge';

import { cartActions } from '@/stores/useCartStore';
import { loginActions } from '@/stores/useLoginStore';
import { userActions } from '@/stores/useUserStore';
import { LoginResponse } from '@/types';
import { DecodedToken, FormatEnum } from '@/types/type';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getRegexpByType = (type: FormatEnum = 'text') => {
  switch (type) {
    case 'number':
    case 'tel':
      return /^[0-9]+$/g;
    case 'text':
      return /^[가-힣ㄱ-ㅎㅏ-ㅣㆍa-zA-Z\s0-9]+$/;
    case 'alphanumericWithSymbols':
      return /^[a-zA-Zㄱ-ㅎㅏ-ㅣㆍ가-힣0-9~?\-_!^.,\s()]*$/;
  }
};

// 정규식 타입으로 문자열 유효성 검사
const validateByType = (value: string, type: FormatEnum): boolean => {
  const regexp = getRegexpByType(type);
  if (!regexp) return true;
  return regexp.test(value);
};

// 비밀번호에 특수문자가 최소 2개 포함되어 있는지 검증
const pwdSpecialCharValidate = (password: string) => {
  const specialChars = password.match(/[!@#$%^&*()_+\-=\[\]{}|;':",./<>?~`]/g);
  return specialChars && specialChars.length >= 2;
};

const validateToken = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);

    if (!decoded || !decoded.exp) return false;

    const currentTime = Date.now() / 1000;

    return currentTime < decoded.exp;
  } catch (error) {
    console.log('[vadiidateToken] error :', error);
    return false;
  }
};

const decodeToken = (token: string): DecodedToken => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );

  return JSON.parse(jsonPayload) as DecodedToken;
};

const localeFormat = (price: number) => {
  if (price === 0) return '0';

  if (!price) return '';

  return price.toLocaleString();
};

const clearLoginInfo = () => {
  loginActions.clearLogout();
  userActions.clearUser();
  removeAccessToken();
};

const allClearPersistStore = () => {
  cartActions.clearCart();
  clearLoginInfo();
};

const delayAsync = (delay: number = 1000): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(10);
    }, delay);
  });
};

const noMainHeaderPage = (pathname: string) => {
  return some(['/cart', '/login', '/payment', '/fail', '/mypage', '/mypage/inquiry'], (path) =>
    startsWith(pathname, path)
  );
};

const getIsMobile = () => {
  const userAgent = navigator.userAgent;
  const isMobile = /mobile/i.test(userAgent);
  return isMobile;
};

const setAccessToken = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken);
};

const getAccessToken = () => {
  return localStorage.getItem('accessToken') || '';
};

const removeAccessToken = () => {
  localStorage.removeItem('accessToken');
};

const getRedirectUrl = () => {
  return localStorage.getItem('redirectUrl') || '/';
};

const setRedirectUrl = (redirectUrl: string) => {
  localStorage.setItem('redirectUrl', redirectUrl);
};

const renewLoginInfo = (refreshResponse: LoginResponse) => {
  const {
    accessToken,
    provider,
    customerKey,
    email,
    username,
    phone,
    profileImage,
    zonecode,
    roadAddress,
    detailAddress,
    role,
  } = refreshResponse;

  setAccessToken(accessToken);

  userActions.setUser({
    customerKey,
    email,
    username,
    phone,
    profileImage,
    zonecode,
    roadAddress,
    detailAddress,
    role,
  });

  loginActions.setLogin({ isLoggedIn: true, provider });
};

const formatDate = (date: Date | undefined, dateFormat: string = 'yyyy-MM-dd') => {
  if (!date) return null;

  return format(date, dateFormat, { locale: ko });
};

export {
  clearLoginInfo,
  allClearPersistStore,
  getRegexpByType,
  validateByType,
  localeFormat,
  pwdSpecialCharValidate,
  validateToken,
  decodeToken,
  delayAsync,
  noMainHeaderPage,
  getIsMobile,
  setAccessToken,
  getAccessToken,
  removeAccessToken,
  renewLoginInfo,
  getRedirectUrl,
  setRedirectUrl,
  formatDate
};
