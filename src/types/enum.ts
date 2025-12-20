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
