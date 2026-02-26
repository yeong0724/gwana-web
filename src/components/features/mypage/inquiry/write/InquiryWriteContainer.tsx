'use client';

import { useMemo, useState } from 'react';

import TiptapEditor from '@/components/common/editor';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import useNativeRouter from '@/hooks/useNativeRouter';
import { validateByType } from '@/lib/utils';
import { useMypageService } from '@/service';
import { useAlertStore, useUserStore } from '@/stores';
import { RoleEnum, YesOrNoEnum } from '@/types/enum';
import { CreateInquiryRequest } from '@/types/request';

type Props = {
  inquiryId: string;
  productId: string | null;
};

const InquiryWriteContainer = ({ inquiryId, productId }: Props) => {
  const { user } = useUserStore();

  const { backward } = useNativeRouter();
  const { showAlert, showConfirmAlert } = useAlertStore();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isSecret, setIsSecret] = useState<YesOrNoEnum>(YesOrNoEnum.YES);
  const [isFocus, setIsFocus] = useState<boolean>(false);

  const { useCreateInquiryMutation } = useMypageService();
  const { mutate: createInquiry } = useCreateInquiryMutation();

  const isAdmin = useMemo(() => {
    if (user.role === RoleEnum.ADMIN && inquiryId) {
      setTitle('안녕하세요 고객님. 답변 드립니다.');
      return true;
    }
    return false;
  }, [user]);

  const handleSubmit = async () => {
    if (!title || title.trim().length < 2) {
      showAlert({
        title: '안내',
        description: '제목을 2자 이상 입력해주세요.',
      });
      return;
    }

    if (!content || content.trim().length < 10) {
      showAlert({
        title: '안내',
        description: '문의내용을 10자 이상 입력해주세요.',
      });
      return;
    }

    const payload: CreateInquiryRequest = {
      title,
      content,
      isSecret,
      productId,
      upperInquiryId: isAdmin && inquiryId ? inquiryId : null,
    };

    createInquiry(payload, {
      onSuccess: async () => {
        const description = isAdmin ? '답변이 제출되었습니다.' : '문의가 제출되었습니다.';

        await showConfirmAlert({
          title: '안내',
          description,
        });

        backward();
      },
      onError: (error) => {
        console.error(error);
      },
    });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (validateByType(value, 'alphanumericWithSymbols')) {
      setTitle(value.slice(0, 20));
    }
  };

  return (
    <div className="flex h-[calc(100dvh-60px)] flex-col overflow-hidden">
      {/* 제목 입력 영역 */}
      <div className="flex shrink-0 items-center gap-2 border-x border-t border-gray-200 bg-white px-4 py-2.5">
        <Input
          type="text"
          placeholder={isFocus ? '' : '제목 (20자 이내)'}
          value={title}
          onChange={(event) => handleTitleChange(event)}
          className="h-8 flex-1 border-none p-0 text-base lg:text-[18px] shadow-none focus-visible:ring-0"
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="shrink-0 rounded-md border border-gray-300 bg-transparent px-4 py-1.5 text-sm lg:text-[17px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          제출
        </button>
      </div>

      {/* 에디터 - 남은 공간을 채움 */}
      <div className="min-h-0 flex-1">
        <TiptapEditor value={content} onChange={setContent} />
      </div>

      {/* 하단 안내 영역 */}
      <div className="flex shrink-0 items-center justify-between border-x border-b border-gray-200 bg-gray-50/50 px-4 py-2.5">
        <p className="text-[13px] text-gray-400">이미지는 최대 5MB까지 첨부 가능합니다</p>
        {!isAdmin && (
          <label className="flex cursor-pointer items-center gap-1.5">
            <Checkbox
              id="isSecret"
              checked={isSecret === 'Y'}
              onCheckedChange={(checked) => setIsSecret(checked ? YesOrNoEnum.YES : YesOrNoEnum.NO)}
            />
            <span className="text-[14px] text-gray-600">비밀글로 작성</span>
          </label>
        )}
      </div>
    </div>
  );
};

export default InquiryWriteContainer;
