'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { forEach } from 'lodash-es';
import { ChevronDown, ChevronRight, MessageCircleQuestion, PenLine, Search } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

import DatePicker from '@/components/common/DatePicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useNativeRouter from '@/hooks/useNativeRouter';
import { formatDate } from '@/lib/utils';
import { useMypageService } from '@/service';
import { useLoginStore, useUserStore } from '@/stores';
import { InquiryListSearchRequest, RoleEnum, YesOrNoEnum } from '@/types';

type SearchParams = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  isChanged: boolean;
  isAnswered: string;
};

const InquiryContainer = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { forward } = useNativeRouter();
  const { isLoggedIn } = useLoginStore();
  const { user } = useUserStore();
  const { ref, inView } = useInView();

  const [searchParams, setSearchParams] = useState<SearchParams>({
    startDate: undefined,
    endDate: undefined,
    isChanged: false,
    isAnswered: 'ALL',
  });

  const [searchPayload, setSearchPayload] = useState<Omit<InquiryListSearchRequest, 'page'>>({
    startDate: null,
    endDate: null,
    isAnswered: '',
    size: 10,
  });

  const { useGetInquiryListInfiniteQuery } = useMypageService();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetInquiryListInfiniteQuery(
    searchPayload,
    {
      enabled: isLoggedIn,
    }
  );

  const inquiryList = data?.pages.flatMap(({ data }) => data.data) ?? [];

  const moveToInquiryWritePage = () => {
    forward('/mypage/inquiry/write');
  };

  const moveToInquiryDetailPage = (inquiryId: number) => {
    forward(`/mypage/inquiry/${inquiryId.toString()}`);
  };

  const onChangeSearchParams = (name: string, value: Date | undefined) => {
    setSearchParams((prev) => ({ ...prev, [name]: value, isChanged: true }));
  };

  const onChangeIsAnsweredFilter = (value: string) => {
    setSearchParams((prev) => ({ ...prev, isChanged: true, isAnswered: value }));
  };

  const onSearch = () => {
    if (searchParams.isChanged) {
      setSearchPayload({
        ...searchPayload,
        startDate: formatDate(searchParams.startDate),
        endDate: formatDate(searchParams.endDate),
        isAnswered: searchParams.isAnswered === 'ALL' ? '' : searchParams.isAnswered,
      });
    } else {
      // refetch();
      queryClient.resetQueries({ queryKey: ['inquiryList'] });
    }

    setSearchParams((prev) => ({ ...prev, isChanged: false }));
  };

  useEffect(() => {
    router.prefetch('/mypage/inquiry/write');

    forEach(inquiryList, ({ inquiryId }) => {
      router.prefetch(`/mypage/inquiry/${inquiryId.toString()}`);
    });
  }, [inquiryList]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="bg-white h-[calc(100dvh-56px)] flex flex-col overflow-hidden">
      <div className="mx-auto w-full flex-1 flex flex-col min-h-0 max-w-[600px] border-x border-gray-100 bg-white">
        {/* 헤더: 타이틀 */}
        <div className="flex items-center justify-between py-2.5 border-b border-gray-100 px-4 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 pl-[5px]">
            <MessageCircleQuestion className="size-6 text-[#A8BF6A]" />
            <span className="text-[18px] font-bold text-gray-800">문의 내역</span>
          </div>
          <Select value={searchParams.isAnswered} onValueChange={onChangeIsAnsweredFilter}>
            <SelectTrigger className="w-[120px] h-9 text-sm">
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">전체</SelectItem>
              <SelectItem value={YesOrNoEnum.YES}>답변 완료</SelectItem>
              <SelectItem value={YesOrNoEnum.NO}>답변 대기중</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 날짜 범위 선택 */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          {/* 시작 날짜 */}
          <div className="w-[40%]">
            <DatePicker
              name="startDate"
              value={searchParams.startDate}
              onSelectDate={onChangeSearchParams}
              placeholder="시작일"
              align="start"
              captionLayout="dropdown"
              disabled={searchParams.endDate ? (date) => date > searchParams.endDate! : undefined}
              useReset
            />
          </div>

          <span className="text-gray-400 text-sm shrink-0">~</span>

          {/* 종료 날짜 */}
          <div className="w-[40%]">
            <DatePicker
              name="endDate"
              value={searchParams.endDate}
              onSelectDate={onChangeSearchParams}
              align="end"
              placeholder="종료일"
              captionLayout="dropdown"
              disabled={
                searchParams.startDate ? (date) => date < searchParams.startDate! : undefined
              }
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
          <div className="flex-1 min-h-0 overflow-y-auto relative">
            <ul className="divide-y divide-gray-100 px-4">
              {inquiryList.map(({ inquiryId, title, createdAt, isAnswered }, index) => (
                <li key={index} className="group">
                  <button
                    onClick={() => moveToInquiryDetailPage(inquiryId)}
                    className="w-full py-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-gray-50/80 rounded-lg -mx-2 px-4"
                  >
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-[14px] text-gray-700 font-semibold truncate group-hover:text-[#A8BF6A] transition-colors">
                        {title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[12px] text-gray-400">{createdAt}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            isAnswered === YesOrNoEnum.YES
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}
                        >
                          {isAnswered === YesOrNoEnum.YES ? '답변완료' : '답변 대기중'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="size-5 text-gray-300 flex-shrink-0 ml-2 group-hover:text-[#A8BF6A] group-hover:translate-x-0.5 transition-all" />
                  </button>
                </li>
              ))}
            </ul>

            {hasNextPage && !isFetchingNextPage && <div ref={ref} className="h-[50px]" />}

            {/* 더 불러올 데이터 있음 표시 - 하단 고정 바운스 아이콘 */}
            {hasNextPage && (
              <div className="sticky bottom-0 left-0 right-0 flex justify-center pointer-events-none">
                <div className="">
                  <ChevronDown className="text-gray-400/90 animate-bounce" size={30} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 문의 작성 버튼 - 하단 고정 */}
        {user.role !== RoleEnum.ADMIN && (
          <div className="flex-shrink-0 bg-white p-4 border-t border-gray-200">
            <button
              onClick={moveToInquiryWritePage}
              className="w-full bg-[#A8BF6A] hover:bg-[#96ad5c] text-white rounded-full py-3 flex items-center justify-center gap-2 transition-colors"
            >
              <PenLine className="size-4" />
              <span className="text-[15px] font-semibold">문의 하기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryContainer;
