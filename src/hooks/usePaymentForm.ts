import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { useLoginStore, useUserStore } from '@/stores';
import { DeliveryRequestEnum, PaymentForm } from '@/types';

const usePaymentForm = () => {
  const { isLoggedIn } = useLoginStore();
  const { user } = useUserStore();

  const form = useForm<PaymentForm>({
    resolver: zodResolver(
      z
        .object({
          senderName: z.string().min(1, { message: '주문고객 이름을 입력해주세요' }),
          senderPhone: z.string().min(1, { message: '주문고객 휴대폰 번호를 입력해주세요' }),
          recipientName: z.string().min(1, { message: '받는 사람 이름을 입력해주세요' }),
          recipientPhone: z.string().min(1, { message: '받는 사람 휴대폰 번호를 입력해주세요' }),
          zonecode: z.string().min(1, { message: '우편번호를 입력해주세요' }),
          roadAddress: z.string().min(1, { message: '도로명 주소를 입력해주세요' }),
          detailAddress: z.string().min(1, { message: '상세 주소를 입력해주세요' }),
          deliveryRequest: z.string().min(1, { message: '배송요청사항을 선택해주세요' }),
          deliveryRequestDetail: z.string(),
        })
        .superRefine((data, ctx) => {
          if (
            data.deliveryRequest === DeliveryRequestEnum.CUSTOM_INPUT &&
            !data.deliveryRequestDetail
          ) {
            ctx.addIssue({
              code: 'custom',
              message: '배송요청사항을 입력해주세요',
              path: ['deliveryRequestDetail'],
            });
          }
        })
    ),
    defaultValues: {
      senderName: '',
      senderPhone: '',
      recipientName: '이은경',
      recipientPhone: '01030777785',
      zonecode: '52302',
      roadAddress: '경남 하동군 화개면 목압길 24-2',
      detailAddress: '관아수제차 1층',
      deliveryRequest: 'LEAVE_AT_GUARD',
      deliveryRequestDetail: '',
    },
    mode: 'onSubmit',
  });

  const { setValue, clearErrors, watch } = form;

  // hydration 완료 후 store의 user 정보로 form 값 업데이트
  useEffect(() => {
    if (isLoggedIn && user) {
      const { username, phone } = user;
      setValue('senderName', username);
      setValue('senderPhone', phone);
    }
  }, [isLoggedIn, user, setValue]);

  return { form, setValue, clearErrors, watch };
};

export default usePaymentForm;
