export enum ResultCode {
  SUCCESS = '0000',
  UNAUTHORIZED = '4005',
  INVALID = '4004',
  FORBIDDEN = '4003',
}

export enum DeliveryRequestEnum {
  LEAVE_AT_DOOR = 'LEAVE_AT_DOOR',
  LEAVE_AT_GUARD = 'LEAVE_AT_GUARD',
  CALL_BEFORE_DELIVERY = 'CALL_BEFORE_DELIVERY',
  DIRECT_HANDOFF = 'DIRECT_HANDOFF',
  NONE = 'NONE',
  CUSTOM_INPUT = 'CUSTOM_INPUT',
}

export enum FlowType {
  Previous = 'previous',
  Next = 'next',
}

// HTTP 메소드 타입 정의
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum SocialProviderEnum {
  KAKAO = 'kakao',
  NAVER = 'naver',
  GOOGLE = 'google',
  NONE = 'none',
}

export enum RoleEnum {
  ADMIN = 'ADMIN',
  GENERAL = 'GENERAL',
}

export enum YesOrNoEnum {
  YES = 'Y',
  NO = 'N',
}

export enum SortByEnum {
  RECOMMENDED = 'recommended',
  LATEST = 'latest',
}

export enum Breakpoint {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
}
