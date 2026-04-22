import { ProductOption, RoleEnum, SocialProviderEnum } from '@/types';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  code: string;
}

export interface ErrorResponse {
  success: false;
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
  isAdminMenu?: boolean;
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
  avgRating: number;
  reviewCount: number;
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

export interface ProductDetailResponse {
  productId: string;
  productName: string;
  categoryId: string;
  categoryName: string;
  images: string[];
  infos: string[];
  price: number;
  shippingPrice: number;
  options: ProductOption[];
}

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
  averageRating: number | null;
};
