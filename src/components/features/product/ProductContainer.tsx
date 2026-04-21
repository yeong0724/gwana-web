'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { concat, filter, forEach } from 'lodash-es';
import { toast } from 'sonner';

import { productMockData } from '@/api/mock';
import { ResponsiveFrame } from '@/components/common/frame';
import ProductMobileView from '@/components/features/product/ProductMobileView';
import { Provider } from '@/context/productContext';
import { useDragScroll } from '@/hooks/useDragScroll';
import useNativeRouter from '@/hooks/useNativeRouter';
import { useProductService } from '@/service';
import { useMenuStore } from '@/stores';
import { DragScrollType } from '@/types';

import ProductWebView from './ProductWebView';

// 카테고리 전환용 애니메이션 duration (ms)
const CATEGORY_ANIMATION_DURATION = 400;

type Props = {
  categoryId: string;
};

const ProductContainer = ({ categoryId }: Props) => {
  // 드래그 스크롤 훅들
  const categoryTabScroll: DragScrollType = useDragScroll();
  const pathname = usePathname();
  const router = useRouter();
  const { forward } = useNativeRouter();
  const {
    menu: { category },
  } = useMenuStore();

  const { useProductListQuery } = useProductService();

  // 동시 슬라이드를 위한 상태
  const [currentCategory, setCurrentCategory] = useState<string>(categoryId);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data: productListData, error: productListError } = useProductListQuery(
    {
      categoryId: '',
    },
    { enabled: true, gcTime: 60 * 60 * 1000, staleTime: 60 * 60 * 1000 }
  );

  // 캐시 데이터를 그대로 파생 — 첫 렌더부터 값이 있음
  const productList = productListData?.data ?? [];

  const productCategory = useMemo(() => {
    const allCategory = [{ menuName: '전체 상품 보기', menuId: 'all', upperMenuId: null }];

    return concat(allCategory, filter(category, { upperMenuId: pathname.replace('/', '') }));
  }, [category, pathname]);

  const onClickCategory = (menuId: string) => {
    if (menuId === categoryId || isTransitioning) return; // 같은 카테고리거나 전환 중이면 무시
    router.push(`/product?category=${menuId}`);
  };

  const onClickProduct = (productId: string) => {
    forward(`/product/${productId}`);
  };

  useEffect(() => {
    if (productListError) {
      toast.error('상품 상세 정보를 불러오는데 실패하였습니다.');
    }
  }, [productListError]);

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

  return (
    <Provider
      state={{
        categoryTabScroll,
        productCategory,
        categoryId,
        currentCategory,
        isTransitioning,
        productList,
      }}
      controller={{ onClickCategory, onClickProduct }}
    >
      <div className="flex min-h-screen bg-warm-50 max-w-[1800px] mx-auto">
        <ResponsiveFrame
          mobileComponent={<ProductMobileView />}
          webComponent={<ProductWebView />}
        />
      </div>
    </Provider>
  );
};

export default ProductContainer;
