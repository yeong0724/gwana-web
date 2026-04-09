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
  categoryId: string;
}

export interface ProductDetailRequest {
  productId: string;
}

export interface ValidateTokenRequest {
  accessToken: string;
}

export interface AddToCartRequest {
  cartItemId: string;
  quantity: number;
}

export interface DeleteCartRequest {
  cartItemId: string;
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

export interface UpdateCartRequest {
  productId: string;
  optionId: string | null;
  quantity: number;
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
