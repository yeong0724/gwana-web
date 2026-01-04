'use client';

import React, { useEffect, useMemo, useState } from 'react';
// Header.tsx
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { filter, size } from 'lodash-es';
import { ChevronLeft, Menu as MenuIcon, ShoppingBag, ShoppingCart, User } from 'lucide-react';

import UserDropdownContent from '@/components/layout/UserDropdownContent';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useNativeRouter from '@/hooks/useNativeRouter';
import { useCartService } from '@/service';
import { useCartStore, useLoginStore, useMenuStore } from '@/stores';
import type { Menu, MenuGroup } from '@/types';

// SSR 비활성화로 import
const Navigation = dynamic(() => import('@/components/layout/Navigation'), {
  ssr: false,
});

type HeaderProps = {
  menuGroup: MenuGroup;
};

const Header = ({ menuGroup }: HeaderProps) => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const { main, category } = menuGroup;
  const queryClient = useQueryClient();
  const router = useRouter();
  const { backward } = useNativeRouter();
  const { setMenu } = useMenuStore();
  const { isLogin } = useLoginStore();
  const { cart } = useCartStore();

  const { useGetCartListQuery } = useCartService();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState<boolean>(false);
  const [isMainHovered, setIsMainHovered] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const { data: cartListData } = useGetCartListQuery({ enabled: isLogin });

  const cartCount = useMemo(() => {
    if (isLogin && cartListData) {
      return size(cartListData.data);
    }

    return size(cart);
  }, [cart, cartListData, isLogin]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const moveToLoginPage = () => {
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
  const moveToMyPage = () => {};

  /**
   * 주문조회 이동
   */
  const moveToOrderHistory = () => {};

  /**
   * 장바구니 이동
   */
  const moveToCartPage = () => {
    router.push('/cart');
  };

  const onClickMain = (menuId: string) => {
    setIsHeaderHovered(false);

    if (menuId === 'product') {
      moveToProductPage('all');
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

  return (
    <div className="sticky top-0 z-50" style={{ viewTransitionName: 'header' }}>
      {/* Main Bar Header */}
      <header
        className={`hidden lg:block sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-white/30'
        } hover:bg-white hover:shadow-lg`}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => {
          setIsHeaderHovered(false);
          setIsMainHovered(false);
        }}
      >
        {/* 카테고리 배경 영역 - 카테고리가 있는 메뉴에 마우스를 올렸을 때만 표시 */}
        <div
          className={`absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-xl transition-all duration-500 ease-in-out origin-top z-10 ${
            isHeaderHovered && isMainHovered
              ? 'scale-y-100 opacity-100 visible'
              : 'scale-y-0 opacity-0 invisible'
          }`}
          style={{ height: '180px' }}
        />

        <div className="mx-auto px-6 relative z-20">
          <div className="flex items-center justify-between h-25">
            <div className="flex flex-1 min-w-0">
              <div className="flex items-center flex-shrink-0 cursor-pointer">
                <Image
                  src="/images/gwana_logo.webp"
                  alt="gwana_logo"
                  width={180}
                  height={100}
                  onClick={() => router.push('/')}
                  className="w-[180px] h-auto"
                  priority
                />
              </div>

              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${menuGroup.main.length}, 1fr)`,
                  gap: 'clamp(1rem, 6vw, 16rem)',
                  marginLeft: 'calc(2rem + 100px)',
                }}
              >
                {main.map(({ menuName, menuId }) => {
                  const categories = filter(category, { upperMenuId: menuId }) as Menu[];

                  return (
                    <div
                      key={menuId}
                      className="relative group flex flex-col items-center justify-start"
                      onMouseEnter={() => setIsMainHovered(true)}
                    >
                      {/* 메인 메뉴 버튼 */}
                      <button
                        className="cursor-pointer flex items-center justify-center text-[24px] space-x-1 py-6 text-sm font-bold text-gray-800 hover:text-green-600 transition-colors duration-500 w-full"
                        onClick={() => onClickMain(menuId)}
                      >
                        <span>{menuName}</span>
                      </button>

                      {/* 카테고리 드롭다운 - 해당 메인 메뉴에 호버시에만 표시 */}
                      <div
                        className={`absolute top-full pt-8 flex flex-col items-center space-y-3 z-30 transition-all duration-500 ease-in-out origin-top ${
                          isHeaderHovered && isMainHovered
                            ? 'scale-y-100 opacity-100 visible'
                            : 'scale-y-0 opacity-0 invisible'
                        }`}
                        onMouseEnter={() => setIsMainHovered(true)}
                      >
                        {categories.map((category) => (
                          <button
                            key={category.menuId}
                            className="cursor-pointer mb-[20px] text-[18px] text-gray-600 hover:text-green-600 transition-colors whitespace-nowrap text-center"
                            onClick={() => onClickCategory(menuId, category.menuId)}
                          >
                            {category.menuName}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center flex-shrink-0 space-x-1 lg:space-x-2">
              <button
                className="relative text-gray-800 cursor-pointer hover:text-green-600 transition-colors p-3 lg:p-4 xl:p-5 duration-500 mr-[30px]"
                onClick={moveToCartPage}
              >
                <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 scale-[1.5]" />
                <span
                  className={`absolute top-[6px] flex items-center justify-center min-w-[20px] h-[20px] px-1 bg-red-500 text-white text-[12px] font-bold rounded-full ${cartCount > 99 ? 'right-[-5px]' : 'right-[5px]'}`}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              </button>
              {isLogin ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-800 cursor-pointer hover:text-green-600 transition-colors p-3 lg:p-4 xl:p-5 duration-500">
                      <User className="w-4 h-4 lg:w-5 lg:h-5 scale-[1.5]" />
                    </button>
                  </DropdownMenuTrigger>
                  <UserDropdownContent
                    handleLogout={handleLogout}
                    moveToMyPage={moveToMyPage}
                    moveToOrderHistory={moveToOrderHistory}
                  />
                </DropdownMenu>
              ) : (
                <button
                  className="text-gray-800 cursor-pointer hover:bg-gray-100 p-2 lg:p-3 transition-colors duration-500 rounded-2xl whitespace-nowrap"
                  onClick={() => router.push('/login')}
                >
                  <span className="font-bold text-sm lg:text-base">로그인</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* Side - Header (Mobile) */}
      <header
        className={`h-[70px] lg:hidden top-0 z-40 ${
          isHomePage
            ? 'absolute left-0 right-0 bg-transparent'
            : 'relative bg-white border-b border-gray-200'
        }`}
      >
        <div className="relative flex items-center justify-between px-4 py-3">
          {/* 왼쪽 - 뒤로가기 */}
          {!isHomePage ? (
            <button
              onClick={goBackWithTransitions}
              className="hover:bg-gray-100 rounded-md transition-colors z-10"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
          ) : (
            <div className="w-6 h-6" />
          )}

          {/* 로고 - 절대 중앙 */}
          <div className="absolute left-1/2 -translate-x-1/2">
            {isHomePage ? (
              <Image
                src="/images/gwana_logo_2.webp"
                alt="gwana_logo"
                width={140}
                height={140}
                onClick={() => router.push('/')}
                className="cursor-pointer"
              />
            ) : (
              <Image
                src="/images/gwana_logo.webp"
                alt="gwana_logo"
                width={100}
                height={100}
                onClick={() => router.push('/')}
                className="cursor-pointer"
              />
            )}
          </div>

          {/* 우측 아이콘들 */}
          <div className="flex items-center space-x-6 z-10">
            <button
              className="relative py-2 hover:bg-gray-100/20 rounded-md transition-colors"
              onClick={() => router.push('/cart')}
            >
              <ShoppingBag
                size={24}
                className={`${isHomePage ? 'text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]' : 'text-gray-700'}`}
              />
              {cartCount > 0 && (
                <span
                  className={`absolute top-[0px] flex items-center justify-center min-w-[20px] h-[20px] px-1 bg-red-500 text-white text-[12px] font-bold rounded-full ${cartCount > 99 ? 'right-[-5px]' : 'right-[-10px]'}`}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            <button
              className="relative py-1 hover:bg-gray-100/20 rounded-md transition-colors"
              onClick={toggleMenu}
            >
              <MenuIcon
                size={24}
                className={`${isHomePage ? 'text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]' : 'text-gray-700'}`}
              />
            </button>
          </div>
        </div>
      </header>
      <Navigation
        isMenuOpen={isMenuOpen}
        moveToLoginPage={moveToLoginPage}
        toggleMenu={toggleMenu}
        menuGroup={menuGroup}
      />
    </div>
  );
};

export default Header;
