import { ChangeEvent, RefObject } from 'react';

import { FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

import { RoleEnum, YesOrNoEnum } from '@/types';

export type HandleChange<T, V> = (
  event: ChangeEvent<T> | null,
  props: {
    name: string;
    value: V;
  }
) => void;

export type FormatEnum = 'number' | 'text' | 'tel' | 'alphanumericWithSymbols';

export type ReactHookFormEventType<T extends FieldValues> = {
  name: FieldPath<T>;
  value: FieldPathValue<T, FieldPath<T>>;
};

export type ItemType = {
  submenuName: string;
  submenuCode: string;
};

export type SubMenuType = {
  category: string;
  categoryCode: string;
  items: Array<ItemType>;
};

export type MenuType = {
  name: string;
  url?: string;
  hasSubmenu: boolean;
  submenu: Array<SubMenuType>;
};

export type BottomMenuType = {
  name: string;
};

export type DecodedToken = {
  exp: number;
  iat: number;
  userId: string;
};

export type UseQueryOptionsType = {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnMount?: boolean | 'always';
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  retry?: boolean | number;
  retryDelay?: number | ((failureCount: number, error: Error) => number);
};

export type CurrentMenu = {
  mainMenuId: string;
  categoryMenuId: string;
};

export interface User {
  customerKey: string;
  email: string;
  username: string;
  phone: string;
  profileImage: string | null;
  zonecode: string | null;
  roadAddress: string | null;
  detailAddress: string | null;
  role: RoleEnum;
}

export type Inquiry = {
  inquiryId: number;
  productId: string | null;
  productName: string | null;
  title: string;
  content: string;
  isSecret: YesOrNoEnum;
  isAnswered: YesOrNoEnum;
  createdAt: string;
  createdBy: string;
  username: string;
  phone: string | null;
  answer: {
    title: string;
    content: string;
    createdAt: string;
  };
};

export type Review = {
  reviewId: number;

  // 리뷰 대상 상품 ID
  productId: string;

  // 리뷰 내용
  content: string;

  // 리뷰 사진
  reviewImages: string[];

  // 리뷰 별점
  rating: number;

  // 작성일
  createdAt: string;

  // 작성자 Id
  createdBy: string;

  // 작성자 이메일
  email: string;
};

export type DropdownOption = {
  value: string;
  label: string;
};

export type DragScrollType = {
  scrollRef: RefObject<HTMLDivElement | null>;
  scrollToElement: (element: HTMLElement) => void;
  dragHandlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
  };
};
