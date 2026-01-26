"use client";

import { useEffect, useMemo, useState } from "react";

import { MessageSquareReply } from "lucide-react";

import { getCleanHtmlContent } from "@/lib/utils";
import { useMypageService } from "@/service";
import { useUserStore } from "@/stores";
import { Inquiry, ResultCode, RoleEnum, YesOrNoEnum } from "@/types";
import useNativeRouter from "@/hooks/useNativeRouter";

type Props = {
  inquiryId: string;
};

const InquiryDetailContainer = ({ inquiryId }: Props) => {
  const { forward } = useNativeRouter();
  const { user } = useUserStore();

  const { useGetInquiryQuery } = useMypageService();
  const { data: inquiryData } = useGetInquiryQuery({ inquiryId }, { enabled: !!inquiryId });

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
  });

  useEffect(() => {
    if (inquiryData) {
      const { code, data } = inquiryData;
      if (code === ResultCode.SUCCESS) {
        setInquiry(data);
      }
    }
  }, [inquiryData]);

  const moveToInquiryWritePage = () => {
    forward(`/mypage/inquiry/write?inquiryId=${inquiryId}`);
  };

  const { title, content, isAnswered, createdAt, username } = inquiry;

  return (
    <div className="bg-white h-[calc(100dvh-56px)] flex flex-col overflow-hidden">
      <div className="mx-auto w-full flex-1 flex flex-col min-h-0 max-w-[600px] border-x border-gray-100 bg-white">
        {/* 문의 헤더 영역 */}
        <div className="px-3 py-3">
          {/* 답변 상태 뱃지 + 제목 */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`shrink-0 text-[10px] px-2 py-1 rounded-full font-medium border ${isAnswered === YesOrNoEnum.YES
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : 'bg-amber-50 text-amber-600 border-amber-200'
                }`}
            >
              {isAnswered === YesOrNoEnum.YES ? '답변완료' : '답변대기'}
            </span>
            <div className="text-[14px] font-semibold text-gray-700 break-words">
              {title}
            </div>
          </div>

          {/* 작성일 | 작성자 */}
          <div className="text-gray-500 text-[12px] px-1">
            {createdAt} <span className="mx-2 text-gray-300">|</span> {username}
          </div>
        </div>

        {/* 구분선 */}
        <div className="w-[90%] mx-auto border-t border-gray-200" />

        {/* 문의 내용 영역 */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
          <div
            className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: getCleanHtmlContent(content) }}
          />
        </div>

        {/* 답변하기 버튼 - ADMIN만 표시, 하단 고정 */}
        {isAdmin && (
          <div className="flex-shrink-0 bg-white p-4 border-t border-gray-200">
            <button
              onClick={moveToInquiryWritePage}
              className="w-full bg-[#A8BF6A] hover:bg-[#96ad5c] text-white rounded-full py-3 flex items-center justify-center gap-2 transition-colors"
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