'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp } from 'lucide-react';
import DaumPostcode, { Address } from 'react-daum-postcode';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import ControllerInput from '@/components/common/ControllerInput';
import ControllerSelect from '@/components/common/ControllerSelect';
import SearchPostcodeModal from '@/components/common/modal/SearchPostcodeModal';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getIsMobile } from '@/lib/utils';
import { useOrderItemStore } from '@/stores';

const DELIVERY_REQUEST_OPTIONS = [
  { value: '문 앞에 놓아주세요.', label: '문 앞에 놓아주세요.' },
  { value: '경비실에 맡겨주세요.', label: '경비실에 맡겨주세요' },
  { value: '배송 전 연락 바랍니다.', label: '배송 전 연락 바랍니다.' },
  { value: '직접 수령하겠습니다.', label: '직접 수령하겠습니다.' },
  { value: '요청사항 없음.', label: '요청사항 없음.' },
];

type PaymentForm = {
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  zonecode: string;
  roadAddress: string;
  detailAddress: string;
  deliveryRequest: string;
};

const inputClassName =
  'w-full px-4 py-2 bg-white rounded-lg border border-gray-200 text-[14px] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500';

const PaymentContainer = () => {
  const isMobile = getIsMobile();
  const { orderItems, clearOrderItems } = useOrderItemStore();

  // 주문고객 섹션 상태
  const [customerOpen, setCustomerOpen] = useState(true);

  // 배송지 섹션 상태
  const [deliveryOpen, setDeliveryOpen] = useState(true);

  // 주소 검색 모달 상태
  const [addressOpen, setAddressOpen] = useState(false);

  const form = useForm<PaymentForm>({
    resolver: zodResolver(
      z.object({
        senderName: z.string().min(1, { message: '주문고객 이름을 입력해주세요' }),
        senderPhone: z.string().min(1, { message: '주문고객 휴대폰 번호를 입력해주세요' }),
        recipientName: z.string().min(1, { message: '받는 사람 이름을 입력해주세요' }),
        recipientPhone: z.string().min(1, { message: '받는 사람 휴대폰 번호를 입력해주세요' }),
        zonecode: z.string().min(1, { message: '우편번호를 입력해주세요' }),
        roadAddress: z.string().min(1, { message: '도로명 주소를 입력해주세요' }),
        detailAddress: z.string().min(1, { message: '상세 주소를 입력해주세요' }),
        deliveryRequest: z.string().min(1, { message: '배송요청사항을 선택해주세요' }),
      })
    ),
    defaultValues: {
      senderName: '',
      senderPhone: '',
      recipientName: '',
      recipientPhone: '',
      zonecode: '',
      roadAddress: '',
      detailAddress: '',
      deliveryRequest: '',
    },
    mode: 'onSubmit',
  });

  const { setValue, clearErrors } = form;

  const handleAddressComplete = (addressData: Address) => {
    setValue('zonecode', addressData.zonecode);
    setValue('roadAddress', addressData.roadAddress);
    clearErrors(['zonecode', 'roadAddress']);
    addressSearchOpenHandler();
  };

  const addressSearchOpenHandler = () => {
    setAddressOpen((prev) => !prev);
  };

  useEffect(() => {
    return () => clearOrderItems();
  }, [orderItems]);

  const onSubmit = (data: PaymentForm) => {
    console.log('결제 데이터:', data);
    // TODO: 결제 처리 로직
  };

  const onError = (errors: FieldErrors<PaymentForm>) => {
    // 주문고객 필드 에러 체크
    if (errors.senderName || errors.senderPhone) {
      setCustomerOpen(true);
    }
    // 배송지 필드 에러 체크
    if (
      errors.recipientName ||
      errors.recipientPhone ||
      errors.zonecode ||
      errors.roadAddress ||
      errors.detailAddress ||
      errors.deliveryRequest
    ) {
      setDeliveryOpen(true);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[500px] mx-auto flex-1 border-x border-gray-100 overflow-hidden bg-gray-100">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* 스크롤 영역 */}
          <div className="flex-1 overflow-y-auto">
            {/* 헤더와 첫 섹션 사이 갭 */}
            <div className="h-2 bg-gray-100" />
            {/* 주문고객 섹션 */}
            <Collapsible open={customerOpen} onOpenChange={setCustomerOpen} className="bg-white">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white">
                <h2 className="text-[16px] font-bold">주문고객</h2>
                {customerOpen ? (
                  <ChevronUp className="size-6" />
                ) : (
                  <ChevronDown className="size-6" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4 space-y-3 bg-white">
                <ControllerInput
                  type="text"
                  name="senderName"
                  placeholder="이름"
                  className={inputClassName}
                />
                <ControllerInput
                  type="number"
                  name="senderPhone"
                  placeholder="휴대폰 ('-' 없이 숫자만 입력)"
                  className={inputClassName}
                />
              </CollapsibleContent>
            </Collapsible>

            <div className="h-3 bg-gray-100" />

            {/* 배송지 섹션 */}
            <Collapsible open={deliveryOpen} onOpenChange={setDeliveryOpen} className="bg-white">
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-5 bg-white">
                <h2 className="text-[16px] font-bold">배송지</h2>
                {deliveryOpen ? (
                  <ChevronUp className="size-6" />
                ) : (
                  <ChevronDown className="size-6" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4 space-y-3 bg-white">
                <ControllerInput
                  type="text"
                  name="recipientName"
                  placeholder="받는 사람"
                  className={inputClassName}
                />
                <ControllerInput
                  type="number"
                  name="recipientPhone"
                  placeholder="휴대폰 ('-' 없이 숫자만 입력)"
                  className={inputClassName}
                />
                <div className="flex gap-2 items-start">
                  <ControllerInput
                    type="text"
                    name="zonecode"
                    placeholder="우편번호"
                    className={inputClassName}
                    wrapperClassName="flex-1"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={addressSearchOpenHandler}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-[12px] sm:text-[14px] font-medium whitespace-nowrap hover:bg-gray-50"
                  >
                    주소 찾기
                  </button>
                </div>
                <ControllerInput
                  type="text"
                  name="roadAddress"
                  placeholder="도로명 주소"
                  className={inputClassName}
                  readOnly
                />
                <ControllerInput
                  name="detailAddress"
                  placeholder="상세 주소"
                  className={inputClassName}
                />
                <ControllerSelect<PaymentForm>
                  name="deliveryRequest"
                  placeholder="배송요청사항 선택"
                  options={DELIVERY_REQUEST_OPTIONS}
                  className={inputClassName}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* 하단 고정 결제 버튼 */}
          <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200">
            <button
              type="submit"
              className="w-full py-4 bg-black text-white text-[16px] font-bold rounded-lg hover:bg-gray-800 transition-colors"
            >
              결제하기
            </button>
          </div>
        </form>
      </FormProvider>
      {/* 모바일: 바텀 시트 */}
      {isMobile && (
        <Sheet open={addressOpen} onOpenChange={setAddressOpen}>
          <SheetContent side="bottom" className="h-full">
            <SheetHeader className="border-b">
              <SheetTitle>주소찾기</SheetTitle>
            </SheetHeader>
            <DaumPostcode
              style={{ width: '100%', height: '100%' }}
              onComplete={handleAddressComplete}
            />
          </SheetContent>
        </Sheet>
      )}
      {/* PC: 다이얼로그 모달 */}
      {!isMobile && (
        <SearchPostcodeModal
          open={addressOpen}
          onOpenChange={setAddressOpen}
          onComplete={handleAddressComplete}
        />
      )}
    </div>
  );
};

export default PaymentContainer;
