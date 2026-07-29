import { SortByEnum, YesOrNoEnum } from './enum';

export interface GetAccessTokenByKakaoCodeRequest {
  code: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type Non = object;

export interface ProductListRequest {
  categorySlug: string | null;
}

export interface ProductDetailRequest {
  productId: number;
}

export interface VariantUpsertRequest {
  productVariantId?: number | null;
  optionLabel: string;
  price: number;
  status?: string;
  sortOrder?: number;
  thumbnailUrl?: string | null;
}

export interface ProductUpdateRequest {
  productId?: number;
  categoryId: number;
  name: string;
  summary?: string | null;
  detailContent?: string | null;
  status?: string;
  shippingPrice?: number;
  variants: VariantUpsertRequest[];
  galleryUrls: string[];
  detailUrls: string[];
  addonIds: number[];
}

export type ProductImageDeleteRequest = {
  imageUrl: string;
};

export type ProductVariantDeleteRequest = {
  productVariantId: number;
  productId: number;
};

export interface ProductAddonUpsertRequest {
  productAddonId?: number | null;
  name: string;
  price: number;
}

export type ProductAddonDeleteRequest = {
  productAddonId: number;
};

export type ProductStatusUpdateRequest = {
  productId: number;
  status: string;
};

export interface ValidateTokenRequest {
  accessToken: string;
}

/* 장바구니 */
export interface UpdateCartRequest {
  productId: number;
  productVariantId: number | null;
  quantity: number;
}

export interface UpsertCartRequest {
  productId: number;
  cartItems: {
    productVariantId: number;
    quantity: number;
  }[];
}

export interface UpdateCartItemQuantityRequest {
  cartItemId: number;
  quantity: number;
}

export interface DeleteCartItemRequest {
  cartItemId: number;
}

export interface DeleteCartRequest {
  cartId: number;
}

export interface KakaoLogoutRequest {
  accessToken: string;
}

export interface CreatePaymentSessionRequest {
  productVariantId: number;
  quantity: number;
}

export interface GetPaymentSessionRequest {
  sessionId: string;
}

export interface SavePaymentInfoRequest {
  sessionId: string;
  orderId: string;
  totalPrice: number;
  totalShippingPrice: number;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  zonecode: string;
  roadAddress: string;
  detailAddress: string;
  deliveryRequest: string;
  deliveryRequestDetail: string;
}

export interface RequestPaymentApproveRequest {
  orderId: string;
  paymentKey: string;
  amount: number;
}

export interface RefreshAccessTokenRequest {
  accessToken: string;
}

export interface UpdateMyinfoRequest {
  email: string;
  phone: string;
  profileImage: string | null;
  zonecode: string | null;
  roadAddress: string | null;
  detailAddress: string | null;
}

export interface CreateInquiryRequest {
  title: string;
  content: string;
  isSecret: YesOrNoEnum;
  productId: string | null;
  upperInquiryId: string | null;
}

export interface ReviewCreateRequest {
  productId: number;
  productVariantId?: number | null;
  content: string;
  rating: number;
  reviewImages: string[];
}

export type InquiryListSearchRequest = {
  startDate: string | null;
  endDate: string | null;
  isAnswered: string;
  page: number;
  size: number;
};

export type ProductInquiryListSearchRequest = {
  productId: number;
  excludeSecret: string;
  isAnswered: string;
  page: number;
  size: number;
};

export type InquirySearchRequest = {
  inquiryId: string;
};

export type ReviewListSearchRequest = {
  productId: number;
  sortBy: SortByEnum;
  photoOnly: boolean;
  page: number;
  size: number;
};

export type OrderSearchRequest = {
  orderId: string;
};
