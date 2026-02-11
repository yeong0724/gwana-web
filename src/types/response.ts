import { RoleEnum, SocialProviderEnum } from '@/types';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  code: string;
}

export interface ErrorResponse {
  success: boolean;
  code: string;
  message: string;
  data: null;
}

export interface UserResponse {
  userId: string;
  username: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'GENERAL';
  customerKey: string;
}

export type Menu = {
  menuName: string;
  menuId: string;
  upperMenuId: string | null;
};

export type MenuGroup = {
  main: Menu[];
  category: Menu[];
};

export type Product = {
  productId: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  images: string[];
  infos: string[];
  price: number;
  shippingPrice: number;
  createdAt: string;
  createdBy: string | null;
  modifiedAt: string;
  modifiedBy: string | null;
};

export type PaymentSession = {
  productId: string;
  productName: string;
  categoryName: string;
  quantity: number;
  price: number;
  shippingPrice: number;
  images: string[];
};

export type PaymentSessionResponse = {
  sessionId: string;
  totalPrice: number;
  totalShippingPrice: number;
  items: PaymentSession[];
};

export interface LoginResponse {
  accessToken: string;
  provider: SocialProviderEnum;
  customerKey: string;
  username: string;
  email: string;
  phone: string;
  profileImage: string | null;
  zonecode: string | null;
  roadAddress: string | null;
  detailAddress: string | null;
  role: RoleEnum;
}

export interface RequestPaymentApproveResponse {
  paymentKey: string;
  orderId: string;
  status: string;
  totalAmount: number;
  method: string;
  approvedAt: string;
  receipt: {
    url: string;
  };
}

export interface ProductOption {
  optionId: string;
  optionName: string;
  productId: string;
  optionPrice: number;
}

export interface ProductDetailResponse {
  productId: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  images: string[];
  infos: string[];
  price: number;
  shippingPrice: number;
  optionRequired: boolean;
  options: ProductOption[];
}

export type PurchaseList = {
  productId: string;
  productName: string;
  categoryName: string;
  optionRequired: boolean;
  price: number;
  shippingPrice: number;
  images: string[];
  quantity: number;
  optionId: string | null;
  optionName: string;
  optionPrice: number;
};

export type CartOption = {
  cartId: string;
  optionId: string;
  optionName: string;
  quantity: number;
  optionPrice: number;
};

export type Cart = {
  cartId: string;
  productId: string;
  productName: string;
  quantity: number;
  categoryName: string;
  price: number;
  shippingPrice: number;
  images: string[];
  optionRequired: boolean;
  options: CartOption[];
};

export type CartState = Cart & { checked: boolean };

export interface UpdateMyinfoResponse {
  phone: string;
  profileImage: string | null;
  zonecode: string | null;
  roadAddress: string | null;
  detailAddress: string | null;
}

export type InfiniteResponse<T> = {
  data: T;
  page: number;
  size: number;
  totalCount: number;
  hasNext: boolean;
  totalPages: number | null;
};
