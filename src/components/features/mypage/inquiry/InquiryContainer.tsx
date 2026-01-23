'use client';

import useNativeRouter from '@/hooks/useNativeRouter';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircleQuestion, PenLine, Inbox, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Inquiry {
  id: number;
  title: string;
  status: 'pending' | 'answered';
  createdAt: string;
}

// 예시 데이터
const mockInquiryList: Inquiry[] = [
  {
    id: 1,
    title: '배송 관련 문의드립니다',
    status: 'answered',
    createdAt: '2025-01-20',
  },
  {
    id: 2,
    title: '주문 취소는 어떻게 하나요?',
    status: 'answered',
    createdAt: '2025-01-18',
  },
  {
    id: 3,
    title: '상품 교환 요청합니다',
    status: 'pending',
    createdAt: '2025-01-15',
  },
  {
    id: 4,
    title: '결제 오류가 발생했어요',
    status: 'pending',
    createdAt: '2025-01-12',
  },
  {
    id: 5,
    title: '회원 등급 관련 문의',
    status: 'answered',
    createdAt: '2025-01-10',
  },
  {
    id: 6,
    title: '배송 관련 문의드립니다',
    status: 'answered',
    createdAt: '2025-01-20',
  },
  {
    id: 7,
    title: '주문 취소는 어떻게 하나요?',
    status: 'answered',
    createdAt: '2025-01-18',
  },
  {
    id: 8,
    title: '상품 교환 요청합니다',
    status: 'pending',
    createdAt: '2025-01-15',
  },
  {
    id: 9,
    title: '결제 오류가 발생했어요',
    status: 'pending',
    createdAt: '2025-01-12',
  },
  {
    id: 10,
    title: '회원 등급 관련 문의',
    status: 'answered',
    createdAt: '2025-01-10',
  },
];

const InquiryContainer = () => {
  const { forward } = useNativeRouter();
  const router = useRouter();

  const inquiryList: Inquiry[] = mockInquiryList;

  const handleWriteInquiry = () => {
    forward('/mypage/inquiry/write');
  };

  useEffect(() => {
    router.prefetch('/mypage/inquiry/write');
  }, []);

  return (
    <div className="bg-white h-[calc(100dvh-56px)] flex flex-col overflow-hidden">
      <div className="mx-auto w-full flex-1 flex flex-col min-h-0 max-w-[600px] border-x border-gray-100 bg-white">
        {/* 헤더: 타이틀 */}
        <div className="flex items-center py-4 border-b border-gray-100 px-4 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 pl-[5px]">
            <MessageCircleQuestion className="size-6 text-[#A8BF6A]" />
            <span className="text-xl font-bold text-gray-800">문의 내역</span>
          </div>
        </div>

        {/* 문의 리스트 영역 */}
        {inquiryList.length === 0 ? (
          // 빈 상태 UI
          <Card className="flex-1 flex flex-col border-0 shadow-none">
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <Inbox className="size-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium">등록된 문의가 없습니다</p>
                <p className="text-sm mt-1">궁금한 점이 있으시면 문의해 주세요</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          // 문의 리스트
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ul className="divide-y divide-gray-100 px-4">
              {inquiryList.map((inquiry) => (
                <li key={inquiry.id} className="group">
                  <button className="w-full py-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-50/80 rounded-lg -mx-2 px-4">
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-gray-800 font-medium truncate group-hover:text-[#A8BF6A] transition-colors">
                        {inquiry.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm text-gray-400">{inquiry.createdAt}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${inquiry.status === 'answered'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}
                        >
                          {inquiry.status === 'answered' ? '답변완료' : '대기중'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="size-5 text-gray-300 flex-shrink-0 ml-2 group-hover:text-[#A8BF6A] group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 문의 작성 버튼 - 하단 고정 */}
        <div className="flex-shrink-0 bg-white p-4 border-t border-gray-200">
          <button
            onClick={handleWriteInquiry}
            className="w-full bg-[#A8BF6A] hover:bg-[#96ad5c] text-white rounded-full py-3 flex items-center justify-center gap-2 transition-colors"
          >
            <PenLine className="size-4" />
            <span className="text-[15px] font-semibold">문의 하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryContainer;