'use client';

import { productMockData } from '@/api/mock';
import ProductList from '@/components/features/product/ProductList';
import { useDragScroll } from '@/hooks/useDragScroll';
import { useMenuStore } from '@/stores';
import { concat, filter, find, forEach } from 'lodash-es';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// 카테고리 전환용 애니메이션 duration (ms)
const CATEGORY_ANIMATION_DURATION = 600;

type Props = {
  categoryId: string;
};

const ProductContainer = ({ categoryId }: Props) => {
  // 드래그 스크롤 훅들
  const categoryTabScroll = useDragScroll();
  const pathname = usePathname();

  // 동시 슬라이드를 위한 상태
  const [currentCategory, setCurrentCategory] = useState<string>(categoryId);
  const [prevCategory, setPrevCategory] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
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
    const scrollToSelectedTab = () => {
      const scrollContainer = categoryTabScroll.scrollRef.current;
      if (!scrollContainer) return;

      const selectedTab = scrollContainer.querySelector(
        `[data-category-id="${categoryId}"]`
      ) as HTMLElement;
      if (!selectedTab) return;

      const containerRect = scrollContainer.getBoundingClientRect();
      const tabRect = selectedTab.getBoundingClientRect();

      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        categoryTabScroll.scrollToElement(selectedTab);
      }
    };

    // 일반적인 경우 (새로고침 등)
    scrollToSelectedTab();

    // View Transition 완료 후에도 실행
    const handleTransitionComplete = () => {
      // 약간의 딜레이를 줘서 DOM이 완전히 안정화된 후 실행
      requestAnimationFrame(() => {
        scrollToSelectedTab();
      });
    };

    window.addEventListener('viewTransitionComplete', handleTransitionComplete);

    return () => {
      window.removeEventListener('viewTransitionComplete', handleTransitionComplete);
    };
  }, [categoryId, categoryTabScroll]);

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

  // 1~9번 상품 페이지 미리 로딩
  useEffect(() => {
    forEach(productMockData, ({ productId }) => {
      router.prefetch(`/product/${productId}`);
    });
  }, []);

  const onClickCategory = (menuId: string) => {
    if (menuId === categoryId || isTransitioning) return; // 같은 카테고리거나 전환 중이면 무시
    router.push(`/product?category=${menuId}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 max-w-[1800px] mx-auto">
      {/* 사이드 네비게이션 - 데스크톱용 */}
      <nav
        className="w-80 bg-white fixed top-[70px] overflow-y-auto flex-shrink-0 hidden lg:block"
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
      <div className="flex-1 p-[20px] md:p-8 pt-5 min-w-0 lg:ml-80 bg-white">
        {/* 모바일/태블릿용 탭 네비게이션 */}
        <div className="lg:hidden mb-6 -mx-4 md:-mx-8">
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
                  className={`pb-4 px-1 cursor-pointer text-lg min-w-[80px] font-medium transition-colors duration-200 relative flex-shrink-0 ${categoryId === menuId ? 'text-black' : 'text-gray-500 hover:text-gray-700'
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
            <div className="absolute inset-0 animate-tab-slide-left-out">
              <ProductList key={prevCategory} categoryId={prevCategory} />
            </div>
          )}

          {/* 들어오는 리스트 (현재 카테고리) */}
          {currentCategory && (
            <div className={isTransitioning ? 'animate-tab-slide-left-in' : ''}>
              <ProductList key={currentCategory} categoryId={currentCategory} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductContainer;
