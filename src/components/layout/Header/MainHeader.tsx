'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { size } from 'lodash-es';

import MobileMainHeader from '@/components/layout/Header/MobileMainHeader';
import WebMainHeader from '@/components/layout/Header/WebMainHeader';
import { Provider } from '@/context/headerContext';
import useIsMobile from '@/hooks/useIsMobile';
import useNativeRouter from '@/hooks/useNativeRouter';
import { useCartService } from '@/service';
import { useCartStore, useLoginStore, useMenuStore } from '@/stores';
import type { MenuGroup } from '@/types';

type HeaderProps = {
  menuGroup: MenuGroup;
};

const MainHeader = ({ menuGroup }: HeaderProps) => {
  const { main, category } = menuGroup;

  const pathname = usePathname();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { isMobile } = useIsMobile();
  const { backward } = useNativeRouter();
  const { setMenu } = useMenuStore();
  const { isLoggedIn } = useLoginStore();
  const { cart } = useCartStore();

  const { useGetCartListQuery } = useCartService();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState<boolean>(false);
  const [isMainHovered, setIsMainHovered] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const { data: cartListData } = useGetCartListQuery({ enabled: isLoggedIn });

  const cartCount = useMemo(() => {
    if (isLoggedIn && cartListData) {
      return size(cartListData.data);
    }

    return size(cart);
  }, [cart, cartListData, isLoggedIn]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const goToLoginPage = () => {
    toggleMenu();
    router.push('/login');
  };

  /**
   * 로그아웃
   */
  const handleLogout = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/oauth2/logout/kakao`;
  };

  /**
   * 마이페이지 이동
   */
  const goToMyPage = () => {
    router.push('/mypage');
  };

  /**
   * 주문조회 이동
   */
  const goToOrderHistoryPage = () => {};

  const onClickMain = (menuId: string) => {
    setIsHeaderHovered(false);

    if (menuId === 'product') {
      moveToProductPage('all');
    } else if (menuId === 'about') {
      router.push('/about');
    }
  };

  const onClickCategory = (mainMenuId: string, categoryMenuId: string) => {
    setIsHeaderHovered(false);
    setIsMainHovered(false);

    if (mainMenuId === 'product') {
      moveToProductPage(categoryMenuId);
    }
  };

  const moveToProductPage = (categoryMenuId: string) => {
    router.push(`/product?category=${categoryMenuId}`);

    // productList로 시작하는 모든 쿼리 무효화 (특정 categoryId 포함)
    queryClient.invalidateQueries({
      queryKey: ['productList'],
      refetchType: 'active', // 활성화된 쿼리만 즉시 재호출
    });
  };

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  const goBackWithTransitions = () => {
    backward();
  };

  const goHome = () => {
    router.push('/');
  };

  const goToCartPage = () => {
    router.push('/cart');
  };

  const modileHeaderStyle = useMemo(() => {
    switch (pathname) {
      case '/':
        return `h-[48px] top-0 z-40 absolute left-0 right-0 ${isScrolled ? 'bg-white border-b border-gray-200' : 'linear-gradient(to bottom, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0) 100%)'}`;
      case '/about':
        return 'h-[58px] top-0 z-40 absolute left-0 right-0 bg-transparent';
      default:
        return `h-[48px] top-0 z-40 relative bg-white ${isScrolled ? 'border-b border-gray-200' : ''}`;
    }
  }, [pathname, isScrolled]);

  /**
   * Menu 정보 Store 저장
   */
  useEffect(() => setMenu(menuGroup), [menuGroup]);

  /**
   * 스크롤 위치에 따라 헤더 배경색 변경
   */
  useEffect(() => {
    // 초기 스크롤 위치 확인
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isMobile) return null;

  return (
    <Provider
      state={{
        isHeaderHovered,
        isMainHovered,
        modileHeaderStyle,
        pathname,
        isScrolled,
        cartCount,
        menuGroup,
        isMenuOpen,
        main,
        category,
        isLoggedIn,
      }}
      controller={{
        setIsHeaderHovered,
        setIsMainHovered,
        goBackWithTransitions,
        goHome,
        goToCartPage,
        goToLoginPage,
        goToMyPage,
        goToOrderHistoryPage,
        toggleMenu,
        onClickMain,
        onClickCategory,
        handleLogout,
      }}
    >
      <div className="sticky top-0 z-50" style={{ viewTransitionName: 'header' }}>
        {isMobile ? (
          <>
            {/* Mobile Header */}
            <MobileMainHeader />
          </>
        ) : (
          <>
            {/* Web(PC) Header */}
            <WebMainHeader />
          </>
        )}
      </div>
    </Provider>
  );
};

export default MainHeader;
