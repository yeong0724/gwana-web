'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { concat, filter, find } from 'lodash-es';

import ProductList from '@/components/features/product/ProductList';
import ProductSkeleton from '@/components/features/product/ProductSkeleton';
import { useDragScroll } from '@/hooks/useDragScroll';
import { usePageTransitions } from '@/hooks/usePageTransitions';
import { useMenuStore } from '@/stores';

// 카테고리 전환용 애니메이션 duration (ms)
const CATEGORY_ANIMATION_DURATION = 500;

const ProductContainer = () => {
  const pageTransitions = usePageTransitions(); // 페이지 전환용 (상위 Provider)

  // 동시 슬라이드를 위한 상태
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [prevCategory, setPrevCategory] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 드래그 스크롤 훅들
  const categoryTabScroll = useDragScroll();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category') ?? 'all';
  const router = useRouter();

  const {
    menu: { category },
  } = useMenuStore();

  const productCategory = useMemo(() => {
    const allCategory = [{ menuName: '전체 상품 보기', menuId: 'all', upperMenuId: null }];

    return concat(allCategory, filter(category, { upperMenuId: pathname.replace('/', '') }));
  }, [category, pathname]);

  // 선택된 탭이 보이도록 자동 스크롤
  useEffect(() => {
    const scrollContainer = categoryTabScroll.scrollRef.current;
    if (!scrollContainer) return;

    const selectedTab = scrollContainer.querySelector(
      `[data-category-id="${categoryId}"]`
    ) as HTMLElement;
    if (!selectedTab) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const tabRect = selectedTab.getBoundingClientRect();

    // 탭이 컨테이너 밖에 있으면 스크롤
    if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
      selectedTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [categoryId, categoryTabScroll.scrollRef]);

  // 페이지 마운트 시 상위 Provider의 show() 호출 (상품 상세에서 뒤로 왔을 때)
  useEffect(() => {
    pageTransitions.show();
  }, []);

  // 초기 카테고리 설정
  useEffect(() => {
    if (currentCategory === null) {
      setCurrentCategory(categoryId);
    }
  }, [categoryId, currentCategory]);

  // URL의 categoryId가 변경되면 동시 슬라이드 애니메이션 시작
  useEffect(() => {
    if (currentCategory !== null && categoryId !== currentCategory && !isTransitioning) {
      // 이전 카테고리 저장하고 전환 시작
      setPrevCategory(currentCategory);
      setCurrentCategory(categoryId);
      setIsTransitioning(true);

      // 애니메이션 완료 후 이전 카테고리 제거
      setTimeout(() => {
        setPrevCategory(null);
        setIsTransitioning(false);
      }, CATEGORY_ANIMATION_DURATION);
    }
  }, [categoryId, currentCategory, isTransitioning]);

  const onClickCategory = (menuId: string) => {
    if (menuId === categoryId || isTransitioning) return; // 같은 카테고리거나 전환 중이면 무시
    router.push(`/product?category=${menuId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 max-w-[1800px] mx-auto">
      {/* 사이드 네비게이션 - 데스크톱용 */}
      <nav
        className="w-80 bg-white fixed top-25 overflow-y-auto flex-shrink-0 hidden lg:block"
        style={{ height: 'calc(100vh - 80px)' }}
      >
        {/* 네비 헤더 - 스티키 */}
        <div className="bg-white z-10 px-5 py-7">
          <h2 className="text-[28px] font-bold text-gray-900">티 제품</h2>
          <div className="w-[98%] h-px bg-gray-800 mt-3" />
        </div>

        {/* 메뉴 리스트 */}
        <div className="py-[5px]">
          {productCategory.map(({ menuId, menuName }) => (
            <div key={menuId} className="mb-1">
              {/* 2뎁스 메뉴 */}
              <button
                onClick={() => onClickCategory(menuId)}
                className={`w-full px-5 py-4 text-left text-[20px] transition-all duration-500 cursor-pointer flex items-center justify-between hover:bg-gray-100 hover:text-green-800 font-bold text-black ${categoryId === menuId ? 'text-green-800' : 'text-black'}`}
              >
                <span>{menuName}</span>
              </button>
            </div>
          ))}
        </div>
      </nav>

      {/* 메인 컨텐츠 영역 - 나머지 공간 차지 */}
      <main className="flex-1 p-8 pt-5 overflow-y-auto min-w-0 lg:ml-80 bg-white">
        {/* 모바일/태블릿용 탭 네비게이션 */}
        <div className="lg:hidden mb-6 -mx-8">
          {/* 카테고리 탭들 */}
          <div className="border-b border-gray-200 mb-4">
            <nav
              ref={categoryTabScroll.scrollRef}
              className="flex space-x-8 overflow-x-auto scrollbar-hide px-8 cursor-grab active:cursor-grabbing"
              {...categoryTabScroll.dragHandlers}
            >
              {productCategory.map(({ menuId, menuName }) => (
                <button
                  key={menuId}
                  data-category-id={menuId}
                  className={`pb-4 px-1 cursor-pointer text-lg min-w-[80px] font-medium transition-colors duration-200 relative flex-shrink-0 ${
                    categoryId === menuId ? 'text-black' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => onClickCategory(menuId)}
                >
                  {menuName}
                  {/* 선택된 탭의 밑줄 */}
                  {categoryId === menuId && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
        {/* 컨텐츠 헤더 */}
        <div className="mb-8">
          <div className="text-gray-700 mb-2 text-[16px]">
            <span className="mr-[10px]">티 제품</span>
            {`>`}
            <span className="mx-[10px] font-bold text-[18px]">
              {find(productCategory, { menuId: categoryId })?.menuName}
            </span>
          </div>
        </div>

        {/* ProductList - 동시 슬라이드 애니메이션 */}
        <div className="relative overflow-hidden">
          {/* 나가는 리스트 (이전 카테고리) */}
          {prevCategory && (
            <div className="absolute inset-0 animate-slide-left-out">
              <Suspense fallback={<ProductSkeleton />}>
                <ProductList key={prevCategory} categoryId={prevCategory} />
              </Suspense>
            </div>
          )}

          {/* 들어오는 리스트 (현재 카테고리) */}
          {currentCategory && (
            <div className={isTransitioning ? 'animate-slide-left-in' : ''}>
              <Suspense fallback={<ProductSkeleton />}>
                <ProductList key={currentCategory} categoryId={currentCategory} />
              </Suspense>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductContainer;
