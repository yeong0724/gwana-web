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
  productId: string;
  quantity: number;
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
