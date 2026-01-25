'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ChevronRight, MessageCircleQuestion, PenLine, Search } from 'lucide-react';

import DatePicker from '@/components/common/DatePicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useNativeRouter from '@/hooks/useNativeRouter';
import { formatDate } from '@/lib/utils';
import { useMypageService } from '@/service';
import { Inquiry, InquiryListSearchRequest, YesOrNoEnum } from '@/types';
import { map } from 'lodash-es';

type SearchParams = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

const InquiryContainer = () => {
  const { forward } = useNativeRouter();
  const router = useRouter();

  const [searchDate, setSearchDate] = useState<SearchParams>({
    startDate: undefined,
    endDate: undefined,
  });

  // const [searchPayload, setSearchPayload] = useState<InquiryListSearchRequest>({
  //   startDate: '',
  //   endDate: '',
  // });

  const searchPayload = useMemo(() => {
    return {
      startDate: formatDate(searchDate.startDate),
      endDate: formatDate(searchDate.endDate),
    };
  }, [searchDate]);
  const [inquiryList, setInquiryList] = useState<Inquiry[]>([]);

  const { useGetInquiryListQuery } = useMypageService();
  const { data: inquiryListData, refetch } = useGetInquiryListQuery(searchPayload, {
    enabled: false,
  });

  const handleWriteInquiry = () => {
    forward('/mypage/inquiry/write');
  };

  const onChangeSearchParams = (name: string, value: Date | undefined) => {
    setSearchDate((prev) => ({ ...prev, [name]: value }));
  };

  const onSearch = () => {
    refetch();
  };

  useEffect(() => {
    if (inquiryListData) {
      setInquiryList(inquiryListData.data);
    }
  }, [inquiryListData]);

  useEffect(() => {
    refetch();
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

        {/* 날짜 범위 선택 */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          {/* 시작 날짜 */}
          <div className="w-[40%]">
            <DatePicker
              name="startDate"
              value={searchDate.startDate}
              onSelectDate={onChangeSearchParams}
              placeholder="시작일"
              align="start"
              disabled={searchDate.endDate ? (date) => date > searchDate.endDate! : undefined}
              useReset
            />
          </div>

          <span className="text-gray-400 text-sm shrink-0">~</span>

          {/* 종료 날짜 */}
          <div className="w-[40%]">
            <DatePicker
              name="endDate"
              value={searchDate.endDate}
              onSelectDate={onChangeSearchParams}
              align="end"
              placeholder="종료일"
              disabled={searchDate.startDate ? (date) => date < searchDate.startDate! : undefined}
              useReset
            />
          </div>

          {/* 조회 버튼 */}
          <Button onClick={onSearch} className="h-9 flex-1 bg-[#A8BF6A] hover:bg-[#96ad5c]">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* 문의 리스트 영역 */}
        {inquiryList.length === 0 ? (
          // 빈 상태 UI
          <Card className="flex-1 flex flex-col border-0 shadow-none">
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <MessageCircleQuestion className="size-16 mb-4 text-gray-300" />
                <p className="text-lg font-medium">등록된 문의가 없습니다</p>
                <p className="text-sm mt-1">궁금한 점이 있으시면 문의해 주세요</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          // 문의 리스트
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ul className="divide-y divide-gray-100 px-4">
              {inquiryList.map(({ title, createdAt, isAnswered }, index) => (
                <li key={index} className="group">
                  <button className="w-full py-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-50/80 rounded-lg -mx-2 px-4">
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-gray-800 font-medium truncate group-hover:text-[#A8BF6A] transition-colors">
                        {title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm text-gray-400">{createdAt}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${isAnswered === YesOrNoEnum.YES
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                            }`}
                        >
                          {isAnswered === YesOrNoEnum.YES ? '답변완료' : '대기중'}
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
