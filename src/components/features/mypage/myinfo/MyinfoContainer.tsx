'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { PenLine, User } from 'lucide-react';
import DaumPostcode, { Address } from 'react-daum-postcode';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import z from 'zod';

import ControllerInput from '@/components/common/ControllerInput';
import SearchPostcodeModal from '@/components/common/modal/SearchPostcodeModal';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getIsMobile } from '@/lib/utils';
import { useLoginStore } from '@/stores';

interface MyInfoForm {
  email: string;
  name: string;
  phoneFirst: string;
  phoneMiddle: string;
  phoneLast: string;
  zonecode: string;
  roadAddress: string;
  detailAddress: string;
}

const MyinfoContainer = () => {
  const isMobile = getIsMobile();
  const {
    loginInfo: { user },
    _hasHydrated,
  } = useLoginStore();
  const form = useForm<MyInfoForm>({
    resolver: zodResolver(
      z.object({
        email: z.string().email({ message: '이메일 형식이 올바르지 않습니다' }),
        name: z.string().min(3, { message: '이름을 입력해주세요' }),
        phoneFirst: z.string().length(3),
        phoneMiddle: z.string().length(4),
        phoneLast: z.string().length(4),
        zonecode: z.string().min(1, { message: '우편번호를 입력해주세요' }),
        roadAddress: z.string().min(1, { message: '도로명 주소를 입력해주세요' }),
        detailAddress: z.string().min(1, { message: '상세 주소를 입력해주세요' }),
      })
    ),
    defaultValues: {
      email: '',
      name: '',
      phoneFirst: '010',
      phoneMiddle: '3561',
      phoneLast: '8411',
      zonecode: '',
      roadAddress: '',
      detailAddress: '',
    },
    mode: 'onSubmit',
  });

  const {
    watch,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = form;

  const [addressOpen, setAddressOpen] = useState<boolean>(false);

  const handleAddressComplete = (addressData: Address) => {
    setValue('zonecode', addressData.zonecode);
    setValue('roadAddress', addressData.roadAddress);
    clearErrors(['zonecode', 'roadAddress']);
    addressSearchOpenHandler();
  };

  const addressSearchOpenHandler = () => {
    setAddressOpen((prev) => !prev);
  };

  const onSubmit = (formData: MyInfoForm) => {
    console.log('수정하기:', formData);
  };

  const onError = (errors: FieldErrors<MyInfoForm>) => { };

  useEffect(() => {
    if (_hasHydrated) {
      const { email, username } = user;
      setValue('email', email);
      setValue('name', username);
    }
  }, [_hasHydrated]);

  return (
    <div className="bg-white h-[calc(100dvh-56px)] flex flex-col overflow-hidden">
      {/* 폼 영역 */}
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="w-full flex-1 flex flex-col min-h-0 bg-white">
            {/* 헤더: 타이틀 */}
            <div className="flex items-center py-4 border-b border-gray-100 px-4 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2 pl-[5px]">
                <User className="size-6 text-gray-800" />
                <span className="text-xl font-bold text-gray-800">내 정보</span>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="p-4 space-y-6">
                {/* 이메일 */}
                <div className="space-y-2">
                  <div className="px-[5px]">
                    <label className="text-gray-800 font-medium text-base">이메일</label>
                  </div>
                  <ControllerInput
                    type="text"
                    name="email"
                    placeholder="이메일"
                    disabled
                    className="w-full px-4 py-2 border-1 border-gray-400 rounded-md text-gray-700 text-base focus:outline-none focus:border-gray-900"
                  />
                </div>

                {/* 이름 */}
                <div className="space-y-2">
                  <div className="px-[5px]">
                    <label className="text-gray-800 font-medium text-base">이름</label>
                  </div>
                  <ControllerInput
                    type="text"
                    name="name"
                    placeholder="이름"
                    className="w-full px-4 py-2 border-1 border-gray-400 rounded-md text-gray-700 text-base focus:outline-none focus:border-gray-900"
                  />
                </div>

                {/* 휴대폰 번호 */}
                <div className="space-y-1">
                  <div className="px-[5px] mb-1">
                    <label className="text-gray-800 font-medium text-base">휴대폰 번호</label>
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
                    <ControllerInput
                      type="tel"
                      name="phoneFirst"
                      className="w-full px-4 py-2 border-1 border-gray-400 rounded-md text-gray-700 text-base focus:outline-none focus:border-gray-900"
                      disableErrorMessage
                      maxLength={3}
                    />
                    <span className="text-gray-400 text-lg">-</span>
                    <ControllerInput
                      type="tel"
                      name="phoneMiddle"
                      className="w-full px-4 py-2 border-1 border-gray-400 rounded-md text-gray-700 text-base focus:outline-none focus:border-gray-900"
                      maxLength={4}
                      disableErrorMessage
                    />
                    <span className="text-gray-400 text-lg">-</span>
                    <ControllerInput
                      type="tel"
                      name="phoneLast"
                      className="w-full px-4 py-2 border-1 border-gray-400 rounded-md text-gray-700 text-base focus:outline-none focus:border-gray-900"
                      maxLength={4}
                      disableErrorMessage
                    />
                  </div>
                  {(errors.phoneFirst || errors.phoneMiddle || errors.phoneLast) && (
                    <div className="text-red-500 pl-2 text-[12px] sm:text-[8px]">
                      휴대폰 번호를 입력해주세요
                    </div>
                  )}
                </div>

                {/* 우편번호 */}
                <div className="space-y-2">
                  <div className="px-[5px]">
                    <label className="text-gray-800 font-medium text-base">우편번호</label>
                  </div>
                  <div className="flex items-start gap-2">
                    <ControllerInput
                      type="tel"
                      name="zonecode"
                      className="w-full px-4 py-2 border-1 border-gray-400 rounded-md text-gray-700 text-base"
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={addressSearchOpenHandler}
                      className="px-6 py-2 border border-gray-800 text-gray-800 rounded-md font-medium text-base hover:bg-gray-800 hover:text-white transition-colors whitespace-nowrap"
                    >
                      검색하기
                    </button>
                  </div>
                </div>

                {/* 주소 */}
                <div className="space-y-2">
                  <label className="text-gray-800 font-medium text-base">주소</label>
                  <ControllerInput
                    type="tel"
                    name="roadAddress"
                    className="w-full px-4 py-2 border-1 border-gray-400 rounded-md text-gray-700 text-base"
                    maxLength={4}
                    readOnly
                  />
                  <ControllerInput
                    type="text"
                    name="detailAddress"
                    placeholder="상세주소를 입력해주세요"
                    className="w-full px-4 py-2 border-1 border-gray-400 rounded-md text-gray-700 text-base focus:outline-none focus:border-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* 수정하기 버튼 - 하단 고정 */}
            <div className="flex-shrink-0 bg-white p-4 border-t border-gray-200">
              <button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-full py-3 flex items-center justify-center gap-2 transition-colors"
              >
                <PenLine className="size-4" />
                <span className="text-[15px] font-semibold">수정하기</span>
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
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

export default MyinfoContainer;
