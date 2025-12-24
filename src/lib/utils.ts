import { clsx, type ClassValue } from 'clsx';
import { some, startsWith } from 'lodash-es';
import { twMerge } from 'tailwind-merge';

import { cartActions } from '@/stores/useCartStore';
import { loginActions } from '@/stores/useLoginStore';
import { DecodedToken, FormatEnum } from '@/types/type';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getRegexpByType = (type: FormatEnum = '') => {
  switch (type) {
    case 'number':
      return /[^0-9]/g;
    case 'text':
      return /[0-9]/g;
    default:
      return '';
  }
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
    if (currentTime > decoded.exp) return false;

    return decoded.exp - currentTime > 0;
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

const allClearPersistStore = () => {
  cartActions.clearCart();
  loginActions.clearLoginInfo();
};

const delayAsync = (delay: number = 1000): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(10);
    }, delay);
  });
};

const noMainHeaderPage = (pathname: string) => {
  return some(['/cart', '/login', '/payment'], (path) => startsWith(pathname, path));
};

const getIsMobile = () => {
  const userAgent = navigator.userAgent;
  const isMobile = /mobile/i.test(userAgent);
  return isMobile;
};

export {
  allClearPersistStore,
  getRegexpByType,
  localeFormat,
  pwdSpecialCharValidate,
  validateToken,
  decodeToken,
  delayAsync,
  noMainHeaderPage,
  getIsMobile,
};
