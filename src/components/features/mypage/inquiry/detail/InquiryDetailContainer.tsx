'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { MessageSquareReply } from 'lucide-react';

import useNativeRouter from '@/hooks/useNativeRouter';
import { getCleanHtmlContent, getPhoneNumber } from '@/lib/utils';
import { useMypageService } from '@/service';
import { useLoginStore, useUserStore } from '@/stores';
import { Inquiry, ResultCode, RoleEnum, YesOrNoEnum } from '@/types';

type Props = {
  inquiryId: string;
};

const InquiryDetailContainer = ({ inquiryId }: Props) => {
  const router = useRouter();
  const { forward } = useNativeRouter();
  const { isLoggedIn } = useLoginStore();
  const { user } = useUserStore();

  const { useGetInquiryQuery } = useMypageService();
  const { data: inquiryData } = useGetInquiryQuery(
    { inquiryId },
    { enabled: !!inquiryId && isLoggedIn }
  );

  const isAdmin = useMemo(() => user.role === RoleEnum.ADMIN, [user]);

  const [inquiry, setInquiry] = useState<Inquiry>({
    inquiryId: 0,
    productId: null,
    productName: null,
    title: '',
    content: '',
    isAnswered: YesOrNoEnum.NO,
    isSecret: YesOrNoEnum.NO,
    createdAt: '',
    createdBy: '',
    username: '',
    phone: null,
    answer: {
      title: '',
      content: '',
      createdAt: '',
    },
  });

  const moveToInquiryWritePage = () => {
    forward(`/mypage/inquiry/write?inquiryId=${inquiryId}`);
  };

  useEffect(() => {
    if (inquiryData) {
      const { code, data } = inquiryData;
      if (code === ResultCode.SUCCESS) {
        setInquiry(data);
      }
    }
  }, [inquiryData]);

  useEffect(() => {
    router.prefetch(`/mypage/inquiry/write?inquiryId=${inquiryId}`);
  }, [router, inquiryId]);

  /**
   * 문의내용
   */
  const { title, content, isAnswered, createdAt, username, phone } = inquiry;

  return (
    <div className="bg-warm-50 h-[calc(100dvh-56px)] flex flex-col overflow-hidden">
      <div className="mx-auto w-full flex-1 flex flex-col min-h-0 max-w-[600px] border-x border-brand-100 bg-white">
        {/* 스크롤 영역 */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* 문의 헤더 영역 */}
          <div className="px-3 py-3">
            {/* 답변 상태 뱃지 + 제목 */}
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`shrink-0 text-[10px] px-2 py-1 rounded-full font-medium border ${isAnswered === YesOrNoEnum.YES
                  ? 'bg-tea-50 text-tea-700 border-tea-200'
                  : 'bg-gold-50 text-gold-600 border-gold-200'
                  }`}
              >
                {isAnswered === YesOrNoEnum.YES ? '답변완료' : '답변대기'}
              </span>
              <div className="text-[14px] font-semibold text-brand-700 break-words">{title}</div>
            </div>

            {/* 작성일 | 작성자 */}
            <div className="text-warm-400 text-[12px] px-1">
              {createdAt} <span className="mx-2 text-warm-200">|</span>{' '}
              {user.role === RoleEnum.ADMIN ? `${username} (${getPhoneNumber(phone)})` : username}
            </div>
          </div>

          {/* 구분선 */}
          <div className="w-[90%] mx-auto border-t border-brand-200" />

          {/* 문의 내용 + 답변 영역 */}
          <div>
            {/* 문의 내용 */}
            <div className="px-4 py-3 min-h-[260px]">
              <div
                className="text-brand-700 leading-relaxed whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{ __html: getCleanHtmlContent(content) }}
              />
            </div>

            {/* 답변 내용 - 답변완료일 때만 표시 */}
            {isAnswered === YesOrNoEnum.YES && inquiry.answer && (
              <>
                {/* 두꺼운 border 구분선 */}
                <div className="w-full border-t-[1px] border-brand-200" />

                {/* 답변 헤더 영역 - 문의와 동일한 구조 */}
                <div className="px-3 py-3">
                  {/* 답변 뱃지 + 제목 */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="shrink-0 text-[11px] px-2 py-1 rounded-full font-medium border bg-tea-50 text-tea-700 border-tea-200">
                      답변
                    </span>
                    {inquiry.answer.title && (
                      <div className="text-[14px] font-semibold text-brand-700 break-words">
                        {inquiry.answer.title}
                      </div>
                    )}
                  </div>

                  {/* 작성일 */}
                  <div className="text-warm-400 text-[12px] px-1">{inquiry.answer.createdAt}</div>
                </div>

                {/* 구분선 */}
                <div className="w-[92%] mx-auto border-t border-brand-200" />

                {/* 답변 내용 */}
                <div className="px-4 py-3">
                  <div
                    className="text-brand-700 leading-relaxed whitespace-pre-wrap break-words"
                    dangerouslySetInnerHTML={{
                      __html: getCleanHtmlContent(inquiry.answer.content),
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* 답변하기 버튼 - ADMIN만 표시, 하단 고정 */}
        {isAdmin && isAnswered === YesOrNoEnum.NO && (
          <div className="flex-shrink-0 bg-white p-4 border-t border-brand-200">
            <button
              onClick={moveToInquiryWritePage}
              className="w-full bg-tea-500 hover:bg-tea-600 text-white rounded-full py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <MessageSquareReply className="size-4" />
              <span className="text-[15px] font-semibold">답변하기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryDetailContainer;
