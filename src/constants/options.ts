import { DeliveryRequestEnum } from '@/types';

export const deliveryRequestOptions = [
  { value: DeliveryRequestEnum.LEAVE_AT_DOOR, label: '문 앞에 놓아주세요.' },
  { value: DeliveryRequestEnum.LEAVE_AT_GUARD, label: '경비실에 맡겨주세요' },
  { value: DeliveryRequestEnum.CALL_BEFORE_DELIVERY, label: '배송 전 연락 바랍니다.' },
  { value: DeliveryRequestEnum.DIRECT_HANDOFF, label: '직접 수령하겠습니다.' },
  { value: DeliveryRequestEnum.NONE, label: '요청사항 없음.' },
  { value: DeliveryRequestEnum.CUSTOM_INPUT, label: '직접입력' },
];
