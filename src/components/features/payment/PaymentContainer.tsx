'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';
import { cloneDeep, first, isEmpty, size } from 'lodash-es';
import { ChevronDown, ChevronUp } from 'lucide-react';
import DaumPostcode, { Address } from 'react-daum-postcode';
import { FieldErrors, FormProvider } from 'react-hook-form';

import ControllerInput from '@/components/common/ControllerInput';
import ControllerSelect from '@/components/common/ControllerSelect';
import { SearchPostcodeModal } from '@/components/common/modal';
import TossPayments from '@/components/features/payment/TossPayments';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { deliveryRequestOptions } from '@/constants';
import usePaymentForm from '@/hooks/usePaymentForm';
import { getIsMobile, localeFormat } from '@/lib/utils';
import { useCartService } from '@/service';
import { useAlertStore } from '@/stores';
import { PaymentForm, PaymentSessionResponse } from '@/types';

const inputClassName =
  'w-full px-4 py-2 bg-white rounded-lg border border-gray-200 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500';

const initialPaymentSession: PaymentSessionResponse = {
  sessionId: '',
  totalPrice: 0,
  totalShippingPrice: 0,
  items: [],
};

type Props = {
  sessionId: string;
};

const PaymentContainer = ({ sessionId }: Props) => {
  const isMobile = getIsMobile();
  const router = useRouter();
  const { showConfirmAlert, showAlert } = useAlertStore();
  const { useGetPaymentSessionQuery } = useCartService();
  const { form, setValue, clearErrors, watch } = usePaymentForm();

  // 주문고객 섹션 상태
  const [sectionOpen, setSectionOpen] = useState({
    customer: true,
    delivery: true,
  });

  // 주소 검색 모달 상태
  const [addressOpen, setAddressOpen] = useState(false);

  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);

  const [paymentSession, setPaymentSession] = useState<PaymentSessionResponse>({
    ...initialPaymentSession,
  });

  const { data: paymentSessionData, error: paymentSessionError } = useGetPaymentSessionQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const handleAddressComplete = (addressData: Address) => {
    setValue('zonecode', addressData.zonecode);
    setValue('roadAddress', addressData.roadAddress);
    clearErrors(['zonecode', 'roadAddress']);
    addressSearchOpenHandler();
  };

  const addressSearchOpenHandler = () => {
    setAddressOpen((prev) => !prev);
  };

  const invalidAccessPaymentSession = async () => {
    await showConfirmAlert({
      title: '에러',
      description: '올바르지 않은 접근입니다.',
      size: 'sm',
    });
    router.push('/');
  };

  const onSubmit = async (data: PaymentForm) => {
    const repProductName = first(paymentSession.items)?.productName ?? '';
    const orderCount = size(paymentSession.items);
    const orderName = orderCount > 1 ? `${repProductName} 외 ${orderCount - 1}건` : repProductName;

    try {
      await widgets!.requestPayment({
        orderId: generateRandomString(),
        orderName,
        successUrl: window.location.origin + '/success',
        failUrl: window.location.origin + '/fail',
        customerEmail: 'customer123@gmail.com',
        customerName: data.senderName,
        customerMobilePhone: data.senderPhone,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '결제 요청 중 오류가 발생했습니다.';

      showAlert({
        title: '에러',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const sectionOpenHandler = (section: 'customer' | 'delivery') => {
    setSectionOpen({ ...sectionOpen, [section]: !sectionOpen[section] });
  };

  const onError = (errors: FieldErrors<PaymentForm>) => {
    const section = cloneDeep(sectionOpen);

    // 주문고객 필드 에러 체크
    if (errors.senderName || errors.senderPhone) {
      section.customer = true;
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
      section.delivery = true;
    }

    setSectionOpen({ ...sectionOpen, ...section });
  };

  const generateRandomString = () => {
    if (typeof window !== 'undefined') {
      return window.btoa(Math.random().toString()).slice(0, 20);
    }

    return ''; // 서버 환경일 경우 기본값 반환
  };

  useEffect(() => {
    if (!sessionId) {
      invalidAccessPaymentSession();
    }
  }, [sessionId]);

  useEffect(() => {
    if (paymentSessionData) {
      (async () => {
        const { data } = paymentSessionData;
        if (isEmpty(data)) {
          await showConfirmAlert({
            title: '에러',
            description: '결제 세션이 만료되었습니다.',
            size: 'sm',
          });
          router.push('/');
        } else {
          setPaymentSession(data);
        }
      })();
    } else if (paymentSessionError) {
      invalidAccessPaymentSession();
    }
  }, [paymentSessionData, paymentSessionError]);

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
            <Collapsible
              open={sectionOpen.customer}
              onOpenChange={() => sectionOpenHandler('customer')}
              className="bg-white"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white">
                <h2 className="text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] font-bold">
                  주문고객
                </h2>
                {sectionOpen.customer ? (
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
                  type="tel"
                  name="senderPhone"
                  placeholder="휴대폰 ('-' 없이 숫자만 입력)"
                  className={inputClassName}
                />
              </CollapsibleContent>
            </Collapsible>

            <div className="h-3 bg-gray-100" />

            {/* 배송지 섹션 */}
            <Collapsible
              open={sectionOpen.delivery}
              onOpenChange={() => sectionOpenHandler('delivery')}
              className="bg-white"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-5 bg-white">
                <h2 className="text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] font-bold">
                  배송지
                </h2>
                {sectionOpen.delivery ? (
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
                  type="tel"
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
                    className="px-4 py-2 border border-gray-300 rounded-lg text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-medium whitespace-nowrap hover:bg-gray-50"
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
                  options={deliveryRequestOptions}
                  className={inputClassName}
                />
                {watch('deliveryRequest') === 'CUSTOM_INPUT' && (
                  <ControllerInput
                    name="deliveryRequestDetail"
                    placeholder="배송요청사항 입력"
                    className={inputClassName}
                  />
                )}
                <span className="ml-[5px] text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] text-gray-500">
                  ※ 제주도 지역은 배송비 4,000원이 추가됩니다.
                </span>
              </CollapsibleContent>
            </Collapsible>

            <div className="h-3 bg-gray-100" />

            {/* 주문상품 섹션 */}
            <div className="bg-white py-1">
              <div className="px-4 py-3">
                <h2 className="text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] font-bold">
                  주문상품
                </h2>
              </div>
              {/* 상품 목록 박스 */}
              <div className="mb-4 bg-white">
                {paymentSession.items.map((item, index) => (
                  <div key={item.productId}>
                    <div className="flex items-start gap-4 px-4 py-3">
                      {/* 상품 이미지 */}
                      <div className="w-[25%] flex-shrink-0 overflow-hidden border border-gray-200 bg-gray-100">
                        {item.images?.[0] && (
                          <Image
                            src={first(item.images)!}
                            alt={item.productName}
                            width={150}
                            height={150}
                            className="object-cover w-full h-auto"
                          />
                        )}
                      </div>
                      {/* 상품 정보 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] text-gray-900 font-medium leading-snug break-words">
                          [{item.categoryName}] {item.productName}
                        </p>
                        <p className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] text-gray-500 mt-2">
                          {localeFormat(item.price)}원 • {item.quantity}개
                        </p>
                        <p className="text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] text-gray-500 mt-1">
                          {item.shippingPrice === 0
                            ? '무료배송'
                            : `배송비 ${localeFormat(item.shippingPrice)}원`}
                        </p>
                      </div>
                    </div>
                    {/* 구분선 */}
                    {index !== paymentSession.items.length - 1 && (
                      <div className="mx-4 border-b border-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="h-3 bg-gray-100" />

            {/* 결제 정보 섹션 */}
            <div className="bg-white px-4 py-5">
              <h2 className="text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] font-bold mb-4">
                결제 정보
              </h2>
              <div className="space-y-3">
                {/* 상품 합계 */}
                <div className="flex items-center justify-between text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px]">
                  <span className="text-gray-700">상품 합계</span>
                  <span className="font-medium">{localeFormat(paymentSession.totalPrice)}원</span>
                </div>
                {/* 배송비 */}
                <div className="flex items-center justify-between text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px]">
                  <span className="text-gray-700 flex items-center gap-2">
                    배송비{' '}
                    <span className="text-gray-400 text-[11px] sm:text-[13px] md:text-[14px] lg:text-[15px]">
                      50,000원 이상 구매시 배송비 무료
                    </span>
                  </span>
                  <span className="font-medium">
                    {localeFormat(paymentSession.totalShippingPrice)}원
                  </span>
                </div>
                {/* 구분선 */}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  {/* 결제 금액 */}
                  <div className="flex items-center justify-between text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px]">
                    <span className="font-bold">결제 금액</span>
                    <span className="font-bold text-blue-600">
                      {localeFormat(paymentSession.totalPrice + paymentSession.totalShippingPrice)}
                      원
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 토스 결제 UI */}
            <TossPayments widgets={widgets} setWidgets={setWidgets} setReady={setReady} />
          </div>

          {/* 하단 고정 결제 버튼 */}
          <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200">
            <button
              type="submit"
              className="w-full py-4 bg-black text-white text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] font-bold rounded-lg hover:bg-gray-800 transition-colors"
              disabled={!ready}
            >
              {`${localeFormat(paymentSession.totalPrice + paymentSession.totalShippingPrice)}원 결제하기`}
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
