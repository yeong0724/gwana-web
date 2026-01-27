'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Camera, PenLine, X } from 'lucide-react';
import DaumPostcode, { Address } from 'react-daum-postcode';
import { FieldErrors, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';

import ControllerInput from '@/components/common/ControllerInput';
import SearchPostcodeModal from '@/components/common/modal/SearchPostcodeModal';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import useMyinfoForm from '@/hooks/useMyinfoForm';
import { getIsMobile } from '@/lib/utils';
import { useMypageService } from '@/service';
import { useAlertStore, useUserStore } from '@/stores';
import { MyinfoForm, ResultCode, UpdateMyinfoRequest } from '@/types';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 2;

const MyinfoContainer = () => {
  const router = useRouter();
  const awsS3Domain = process.env.NEXT_PUBLIC_AWS_S3_DOMAIN || '';
  const isMobile = getIsMobile();

  const { showAlert, showConfirmAlert } = useAlertStore();
  const { setUser } = useUserStore();

  const { form, setValue, handleSubmit, clearErrors, errors, watch } = useMyinfoForm();
  const profileImage = watch('profileImage');

  const { useProfileImageUploadMutation, useUpdateMyinfoMutation } = useMypageService();
  const { mutateAsync: uploadProfileImage } = useProfileImageUploadMutation();
  const { mutate: updateMyinfo } = useUpdateMyinfoMutation();

  const [addressOpen, setAddressOpen] = useState<boolean>(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  // input refs
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedProfileImageFile, setSelectedProfileImageFile] = useState<File | null>(null);

  const setInputRef = (name: string) => (el: HTMLInputElement | null) => {
    inputRefs.current[name] = el;
  };

  const handleAddressComplete = (addressData: Address) => {
    setValue('zonecode', addressData.zonecode);
    setValue('roadAddress', addressData.roadAddress);
    clearErrors(['zonecode', 'roadAddress']);
    addressSearchOpenHandler();
  };

  const addressSearchOpenHandler = () => {
    setAddressOpen((prev) => !prev);
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 확장자 검사
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      showAlert({
        title: '업로드 불가',
        description: '허용된 확장자는 jpeg, png, webp 입니다.',
      });
      e.target.value = '';
      return;
    }

    // 용량 검사
    if (file.size > MAX_FILE_SIZE * 1024 * 1024) {
      showAlert({
        title: '업로드 불가',
        description: `업로드 가능한 용량은 ${MAX_FILE_SIZE}MB 이하입니다.`,
      });
      e.target.value = '';
      return;
    }

    // 미리보기 이미지 세팅
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImg(reader.result as string);
    };

    reader.readAsDataURL(file);

    setSelectedProfileImageFile(file);

    e.target.value = '';
  };

  const handleClearPreview = () => {
    setPreviewImg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (values: MyinfoForm) => {
    const { email, phoneFirst, phoneMiddle, phoneLast, zonecode, roadAddress, detailAddress } =
      values;
    const payload: UpdateMyinfoRequest = {
      email,
      zonecode,
      roadAddress,
      detailAddress,
      profileImage,
      phone: `${phoneFirst}${phoneMiddle}${phoneLast}`,
    };

    const confirm = await showConfirmAlert({
      title: '안내',
      description: '회원 정보를 수정하시겠습니까?',
      cancelText: '취소',
    });

    if (!confirm) return;

    if (selectedProfileImageFile) {
      const formData = new FormData();
      formData.append('prevProfileImage', profileImage || '');
      formData.append('profileImage', selectedProfileImageFile);

      const { code, data } = await uploadProfileImage(formData);
      if (code === ResultCode.SUCCESS) {
        payload.profileImage = data;
      }
    }

    updateMyinfo(payload, {
      onSuccess: ({ code, data }) => {
        if (code === ResultCode.SUCCESS) {
          toast.success('회원정보가 수정되었습니다.');
          setUser(data);
          router.prefetch('/mypage');
        }
      },
    });
  };

  const onError = (errors: FieldErrors<MyinfoForm>) => {
    const focusOrder: (keyof MyinfoForm)[] = [
      'username',
      'phoneFirst',
      'phoneMiddle',
      'phoneLast',
      'zonecode',
      'roadAddress',
      'detailAddress',
    ];

    // 우선순위대로 첫 번째 에러 필드 찾아서 포커스
    for (const fieldName of focusOrder) {
      if (errors[fieldName] && inputRefs.current[fieldName]) {
        inputRefs.current[fieldName]?.focus();
        break;
      }
    }
  };

  return (
    <div className="bg-white h-[calc(100dvh-56px)] flex flex-col overflow-hidden">
      {/* 폼 영역 */}
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="w-full flex-1 flex flex-col min-h-0 bg-white">
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="p-4 space-y-6">
                {/* 프로필 이미지 */}
                <div className="flex justify-center py-4">
                  <div className="relative">
                    {/* 프로필 이미지 원형 */}
                    <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                      {!previewImg && !profileImage ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400 text-4xl font-bold">
                            {watch('username')?.substring(1, 3)}
                          </span>
                        </div>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`${previewImg || awsS3Domain + profileImage || ''}`}
                          alt="프로필 미리보기"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* 카메라/X 아이콘 버튼 (5시 방향) */}
                    <button
                      type="button"
                      onClick={previewImg ? handleClearPreview : handleFileInputClick}
                      className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-900 flex items-center justify-center transition-colors shadow-md"
                    >
                      {previewImg ? (
                        <X className="w-4 h-4 text-white" />
                      ) : (
                        <Camera className="w-4 h-4 text-white" />
                      )}
                    </button>

                    {/* 숨겨진 파일 input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

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
                    className="w-full px-4 py-2 border-1 border-gray-400 rounded-md text-gray-700 text-base"
                  />
                </div>

                {/* 이름 */}
                <div className="space-y-2">
                  <div className="px-[5px]">
                    <label className="text-gray-800 font-medium text-base">이름</label>
                  </div>
                  <ControllerInput
                    type="text"
                    name="username"
                    placeholder="이름"
                    className="w-full px-4 py-2 border-1 border-gray-400 rounded-md text-gray-700 text-base"
                    disabled
                    inputRef={setInputRef('username')}
                  />
                </div>

                {/* 휴대폰 번호 */}
                <div className="space-y-1 mb-[0px]">
                  <div className="px-[5px] mb-1">
                    <label className="text-gray-800 font-medium text-base">휴대폰 번호</label>
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
                    <ControllerInput
                      type="tel"
                      name="phoneFirst"
                      className="w-full px-4 py-2 border-1 border-gray-400 rounded-md text-gray-700 text-base"
                      disableErrorMessage
                      maxLength={3}
                      inputRef={setInputRef('phoneFirst')}
                    />
                    <span className="text-gray-400 text-lg">-</span>
                    <ControllerInput
                      type="tel"
                      name="phoneMiddle"
                      className="w-full px-4 py-2 border-1 border-gray-400 rounded-md text-gray-700 text-base"
                      disableErrorMessage
                      maxLength={4}
                      inputRef={setInputRef('phoneMiddle')}
                    />
                    <span className="text-gray-400 text-lg">-</span>
                    <ControllerInput
                      type="tel"
                      name="phoneLast"
                      className="w-full px-4 py-2 border-1 border-gray-400 rounded-md text-gray-700 text-base"
                      disableErrorMessage
                      maxLength={4}
                      inputRef={setInputRef('phoneLast')}
                    />
                  </div>
                  <span
                    className={`pl-2 text-[12px] sm:text-[8px] block ${
                      errors.phoneFirst || errors.phoneMiddle || errors.phoneLast
                        ? 'text-red-500'
                        : 'invisible'
                    }`}
                  >
                    휴대폰 번호를 입력해주세요
                  </span>
                </div>

                {/* 우편번호 */}
                <div className="space-y-2">
                  <div className="px-[5px] text-gray-800 font-medium text-base">우편번호</div>
                  <div className="flex items-start gap-2">
                    <ControllerInput
                      type="tel"
                      name="zonecode"
                      className="w-full px-4 py-2 border-1 border-gray-400 rounded-md text-gray-700 text-base"
                      readOnly
                      inputRef={setInputRef('zonecode')}
                    />
                    <button
                      type="button"
                      onClick={addressSearchOpenHandler}
                      className="px-6 py-[6px] border border-gray-800 text-gray-800 rounded-md font-medium text-[14px] hover:bg-gray-800 hover:text-white transition-colors whitespace-nowrap"
                    >
                      검색하기
                    </button>
                  </div>
                </div>

                {/* 주소 */}
                <div className="space-y-2">
                  <div className="px-[5px] text-gray-800 font-medium text-base">주소</div>
                  <ControllerInput
                    type="text"
                    name="roadAddress"
                    className="w-full px-4 py-2 border-1 border-gray-400 rounded-md text-gray-700 text-base"
                    readOnly
                    inputRef={setInputRef('roadAddress')}
                  />
                  <ControllerInput
                    type="alphanumericWithSymbols"
                    name="detailAddress"
                    placeholder="상세주소를 입력해주세요"
                    maxLength={30}
                    className="w-full px-4 py-2 border-1 border-gray-400 rounded-md text-gray-700 text-base"
                    inputRef={setInputRef('detailAddress')}
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
