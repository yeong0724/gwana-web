import { Order, OrderOptionGroup, RoleEnum, SocialProviderEnum } from '@/types';

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
  productId: number;
  name: string;
  categoryId: number;
  categorySlug: string;
  categoryName: string;
  summary: string | null;
  detailContent?: string | null;
  status: string;
  displayPrice: number;
  shippingPrice: number;
  thumbnailUrl: string | null; // gallery[0]
  avgRating: number;
  reviewCount: number;
};

// 판매 단위(SKU)
export type ProductVariant = {
  productVariantId: number;
  productId: number;
  optionLabel: string;
  price: number;
  status: string;
  sortOrder: number;
  thumbnailUrl: string | null;
  // 프론트 전용: 드래그 재정렬/리스트 key 안정화용 (서버 미전송)
  clientId?: string;
};

// 추가상품(애드온)
export type ProductAddon = {
  productAddonId: number;
  name: string;
  price: number;
};

export type PaymentSession = {
  productVariantId: number;
  productId: number;
  productName: string;
  categoryName: string;
  optionLabel: string;
  quantity: number;
  price: number;
  shippingPrice: number;
  thumbnailUrl: string | null;
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
  productId: number;
  name: string;
  categoryId: number;
  categoryName: string;
  summary: string | null;
  detailContent: string | null;
  status: string;
  shippingPrice: number;
  displayPrice: number;
  galleryImages: string[];
  detailImages: string[];
  variants: ProductVariant[];
  addons: ProductAddon[];
  avgRating: number;
  reviewCount: number;
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

export type OrderResponse = Order & { orderOptionGroups: OrderOptionGroup[] };
