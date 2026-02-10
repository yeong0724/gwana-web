'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { concat, filter, find, forEach, map } from 'lodash-es';

import { productMockData } from '@/api/mock';
import ProductCard from '@/components/features/product/ProductCard';
import { useDragScroll } from '@/hooks/useDragScroll';
import useIsMobile from '@/hooks/useIsMobile';
import useNativeRouter from '@/hooks/useNativeRouter';
import { cn } from '@/lib/utils';
import { useMenuStore } from '@/stores';

// 카테고리 전환용 애니메이션 duration (ms)
const CATEGORY_ANIMATION_DURATION = 400;

type Props = {
  categoryId: string;
};

const ProductContainer = ({ categoryId }: Props) => {
  // 드래그 스크롤 훅들
  const categoryTabScroll = useDragScroll();
  const pathname = usePathname();
  const { forward } = useNativeRouter();
  const { isMobile } = useIsMobile();

  // 동시 슬라이드를 위한 상태
  const [currentCategory, setCurrentCategory] = useState<string>(categoryId);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const {
    menu: { category },
  } = useMenuStore();

  const productCategory = useMemo(() => {
    const allCategory = [{ menuName: '전체 상품 보기', menuId: 'all', upperMenuId: null }];

    return concat(allCategory, filter(category, { upperMenuId: pathname.replace('/', '') }));
  }, [category, pathname]);

  const productList = useMemo(() => {
    return categoryId === 'all' ? productMockData : filter(productMockData, { categoryId });
  }, [categoryId]);

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
      setCurrentCategory(categoryId);
      setIsTransitioning(true);

      // 애니메이션 완료 후 이전 카테고리 제거
      setTimeout(() => {
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

  const onClickProduct = (productId: string) => {
    forward(`/product/${productId}`);
  };

  if (!isMobile) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 max-w-[1800px] mx-auto">
      {isMobile ? (
        <div className="flex-1 px-[15px] pt-[10px] pb-40 min-w-0 lg:ml-80 bg-white">
          <div className="mb-5 md:-mx-8">
            <div className="mb-4">
              <nav
                ref={categoryTabScroll.scrollRef}
                className="flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing relative"
                {...categoryTabScroll.dragHandlers}
              >
                {productCategory.map(({ menuId, menuName }) => (
                  <button
                    key={menuId}
                    data-category-id={menuId}
                    className={`pb-[12px] pt-[5px] cursor-pointer text-[13px] w-[100px] font-medium transition-colors duration-200 flex-shrink-0 text-center ${
                      categoryId === menuId ? 'text-black' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => onClickCategory(menuId)}
                  >
                    {menuName}
                  </button>
                ))}
                {/* 탭 밑줄 인디케이터 - nav 안쪽에서 스크롤과 함께 이동 */}
                <div
                  className="absolute bottom-0 h-[2px] bg-black transition-all duration-300 ease-out"
                  style={{
                    width: '100px',
                    left: `${productCategory.findIndex(({ menuId }) => menuId === categoryId) * 100}px`,
                  }}
                />
              </nav>
              {/* 하단 배경 라인 */}
              <div className="h-[2px] bg-gray-200" />
            </div>
          </div>
          <div className="mb-6">
            <div className="text-gray-700 pl-[5px] mb-2 text-[15px]">
              <span className="mr-[10px]">티 제품</span>
              {`>`}
              <span className="mx-[10px] font-bold text-[15px]">
                {find(productCategory, { menuId: categoryId })?.menuName}
              </span>
            </div>
          </div>
          {/* ProductList - 동시 슬라이드 애니메이션 */}
          <div className="relative overflow-hidden">
            {/* 들어오는 리스트 (현재 카테고리) */}
            {currentCategory && (
              <div className={isTransitioning ? 'animate-tab-slide-left-in' : ''}>
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-[16px] gap-y-10 md:gap-x-4 md:gap-y-10">
                  {map(productList, (product) => (
                    <ProductCard
                      key={product.productId}
                      product={product}
                      onClickProduct={onClickProduct}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <nav
            className="block w-80 bg-white fixed top-[60px] overflow-y-auto flex-shrink-0"
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
                    className={cn(
                      'w-full px-5 py-4 transition-all duration-500 cursor-pointer flex items-center justify-between',
                      'font-bold text-left text-[20px] text-black hover:text-green-800',
                      'bg-white hover:bg-gray-100',
                      categoryId === menuId ? 'text-green-800' : 'text-black'
                    )}
                  >
                    <span>{menuName}</span>
                  </button>
                </div>
              ))}
            </div>
          </nav>
          {/* 메인 컨텐츠 영역 - 나머지 공간 차지 */}
          <div className="flex-1 px-[15px] pt-[10px] pb-40 min-w-0 lg:ml-80 bg-white">
            <div className="mb-6">
              <div className="text-gray-700 pl-[5px] mb-2 text-[15px]">
                <span className="mr-[10px]">티 제품</span>
                {`>`}
                <span className="mx-[10px] font-bold text-[15px]">
                  {find(productCategory, { menuId: categoryId })?.menuName}
                </span>
              </div>
            </div>
            {/* ProductList - 동시 슬라이드 애니메이션 */}
            <div className="relative overflow-hidden">
              {/* 들어오는 리스트 (현재 카테고리) */}
              {currentCategory && (
                <div className={isTransitioning ? 'animate-tab-slide-left-in' : ''}>
                  <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-[16px] gap-y-10 md:gap-x-4 md:gap-y-10">
                    {map(productList, (product) => (
                      <ProductCard
                        key={product.productId}
                        product={product}
                        onClickProduct={onClickProduct}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductContainer;
