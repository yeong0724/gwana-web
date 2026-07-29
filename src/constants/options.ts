import { DeliveryRequestEnum, ProductStatus } from '@/types';

export const deliveryRequestOptions = [
  { value: DeliveryRequestEnum.LEAVE_AT_DOOR, label: '문 앞에 놓아주세요.' },
  { value: DeliveryRequestEnum.LEAVE_AT_GUARD, label: '경비실에 맡겨주세요' },
  { value: DeliveryRequestEnum.CALL_BEFORE_DELIVERY, label: '배송 전 연락 바랍니다.' },
  { value: DeliveryRequestEnum.DIRECT_HANDOFF, label: '직접 수령하겠습니다.' },
  { value: DeliveryRequestEnum.NONE, label: '요청사항 없음.' },
  { value: DeliveryRequestEnum.CUSTOM_INPUT, label: '직접입력' },
];

export const categoryOptions = [
  { value: '1', label: '녹차', slug: 'greenTea' },
  { value: '2', label: '발효차', slug: 'blackTea' },
  { value: '3', label: '대용차', slug: 'substituteTea' },
];

export const productStatusOptions = [
  { value: ProductStatus.ON_SALE, label: '판매중' },
  { value: ProductStatus.SOLD_OUT, label: '품절' },
  { value: ProductStatus.HIDDEN, label: '숨김' },
  { value: ProductStatus.DISCONTINUED, label: '단종' },
];

// 고객 화면에서 노출되는 비판매 상태 뱃지 (판매중은 뱃지 없음)
export const customerStatusBadge: Record<string, string> = {
  [ProductStatus.SOLD_OUT]: '품절',
  [ProductStatus.DISCONTINUED]: '단종',
};
