import { SortByEnum, YesOrNoEnum } from './enum';
import { ProductDetailResponse } from './response';

export interface GetAccessTokenByKakaoCodeRequest {
  code: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type Non = object;

export interface ProductListRequest {
  categoryId: string;
}

export interface ProductDetailRequest {
  productId: string;
}

export type ProductUpdateRequest = ProductDetailResponse;

export type ProductImageDeleteRequest = {
  imageUrl: string;
};

export interface ValidateTokenRequest {
  accessToken: string;
}

/* 장바구니 */
export interface UpdateCartRequest {
  productId: string;
  optionId: string | null;
  quantity: number;
}

export interface UpsertCartRequest {
  productId: string;
  cartItems: {
    productOptionId: string;
    quantity: number;
  }[];
}

export interface UpdateCartItemQuantityRequest {
  cartItemId: string;
  quantity: number;
}

export interface DeleteCartItemRequest {
  cartItemId: string;
}

export interface DeleteCartRequest {
  cartId: string;
}

export interface KakaoLogoutRequest {
  accessToken: string;
}

export interface CreatePaymentSessionRequest {
  productId: string;
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
  productId: string;
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

export type InquirySearchRequest = {
  inquiryId: string;
};

export type ReviewListSearchRequest = {
  productId: string;
  sortBy: SortByEnum;
  photoOnly: boolean;
  page: number;
  size: number;
};
