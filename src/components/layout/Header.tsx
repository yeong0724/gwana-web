'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import { filter, isEmpty, size } from 'lodash-es';
import { ChevronLeft, Menu as MenuIcon, ShoppingCart, User } from 'lucide-react';

import UserDropdownContent from '@/components/layout/UserDropdownContent';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useNativeRouter from '@/hooks/useNativeRouter';
import { useCartService } from '@/service';
import { useCartStore, useLoginStore, useMenuStore } from '@/stores';
import type { Menu, MenuGroup } from '@/types';
import { AWS_S3_DOMAIN } from '@/constants';

// SSR 비활성화로 import
const Navigation = dynamic(() => import('@/components/layout/Navigation'), {
  ssr: false,
});

type HeaderProps = {
  menuGroup: MenuGroup;
};

const Header = ({ menuGroup }: HeaderProps) => {
  const pathname = usePathname();
  const isHomePage = pathname === '/about';

  const { main, category } = menuGroup;
  const queryClient = useQueryClient();
  const router = useRouter();
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
  const moveToMyPage = () => {
    router.push('/mypage');
  };

  /**
   * 주문조회 이동
   */
  const moveToOrderHistory = () => { };

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

  // `h-[58px] md:hidden top-0 z-40 ${isHomePage ? 'absolute left-0 right-0 bg-transparent' : `relative ${isScrolled ? 'bg-white border-b border-gray-200' : ''}`}`

  const modileHeaderStyle = useMemo(() => {
    switch (pathname) {
      case '/':
        return `h-[48px] md:hidden top-0 z-40 absolute left-0 right-0 ${isScrolled ? 'bg-white border-b border-gray-200' : 'linear-gradient(to bottom, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0) 100%)'}`;
      case '/about':
        return 'h-[58px] md:hidden top-0 z-40 absolute left-0 right-0 bg-transparent';
      default:
        return `h-[48px] md:hidden top-0 z-40 relative bg-white ${isScrolled ? 'border-b border-gray-200' : ''}`;
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

  return (
    <div className="sticky top-0 z-50" style={{ viewTransitionName: 'header' }}>
      {/* Main Bar Header */}
      <header
        className="hidden md:block sticky h-[60px] top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background:
            isScrolled || isHeaderHovered
              ? 'white'
              : 'linear-gradient(to bottom, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0) 100%)',
          boxShadow: isScrolled || isHeaderHovered ? '0 10px 15px -3px rgb(0 0 0 / 0.1)' : 'none',
        }}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => {
          setIsHeaderHovered(false);
          setIsMainHovered(false);
        }}
      >
        {/* 카테고리 배경 영역 - 카테고리가 있는 메뉴에 마우스를 올렸을 때만 표시 */}
        <div
          className={`absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-xl transition-all duration-500 ease-in-out origin-top z-10 ${isHeaderHovered && isMainHovered
            ? 'scale-y-100 opacity-100 visible'
            : 'scale-y-0 opacity-0 invisible'
            }`}
          style={{ height: '180px' }}
        />

        <div className="mx-auto px-6 relative z-20 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex flex-1 min-w-0">
              <div
                className="flex items-center flex-shrink-0 cursor-pointer pl-8"
                style={{ filter: 'drop-shadow(0.5px 0 0 black) ' }}
              // drop-shadow(0 0 0.5px black)
              >
                <Image
                  src={`${AWS_S3_DOMAIN}images/logo/gwana_logo_2.webp`}
                  alt="gwana_logo"
                  width={120}
                  height={80}
                  onClick={() => router.push('/')}
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
                    >
                      {/* 메인 메뉴 버튼 */}
                      <button
                        className={`cursor-pointer flex items-center justify-center text-[18px] text-black space-x-1 py-6 font-sans font-semibold tracking-wider hover:text-gray-500 transition-all duration-500 w-full`}
                        onClick={() => onClickMain(menuId)}
                        onMouseEnter={() => {
                          if (!isEmpty(categories)) setIsMainHovered(true);
                        }}
                        onMouseLeave={() => setIsMainHovered(false)}
                      >
                        <span
                        // className="[text-shadow:_-0.4px_0_white,_0.4px_0_white,_0_-0.4px_white,_0_0.4px_white]"
                        >
                          {menuName}
                        </span>
                      </button>

                      {/* 카테고리 드롭다운 - 해당 메인 메뉴에 호버시에만 표시 */}
                      <div
                        className={`absolute top-full pt-5 flex flex-col items-center space-y-3 z-30 transition-all duration-500 ease-in-out origin-top ${isHeaderHovered && isMainHovered
                          ? 'scale-y-100 opacity-100 visible'
                          : 'scale-y-0 opacity-0 invisible'
                          }`}
                        onMouseEnter={() => setIsMainHovered(true)}
                      >
                        {categories.map((category) => (
                          <button
                            key={category.menuId}
                            className="cursor-pointer mb-[20px] text-[18px] text-gray-600 hover:text-gray-400 transition-colors whitespace-nowrap text-center"
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
            <div className="flex items-center flex-shrink-0 space-x-1 lg:space-x-8">
              <button
                className="relative text-black cursor-pointer hover:text-gray-400 transition-all p-3 lg:p-4 xl:p-5 duration-500 mr-[30px]"
                onClick={moveToCartPage}
              >
                <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 scale-[1.2]" />
                <span
                  className={`absolute top-[6px] flex items-center justify-center min-w-[20px] h-[20px] px-1 bg-red-500 text-white text-[12px] font-bold rounded-full ${cartCount > 99 ? 'right-[-5px]' : 'right-[5px]'}`}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              </button>
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-black cursor-pointer hover:text-gray-400 transition-all p-3 lg:p-4 xl:p-5 duration-500">
                      <User className="w-4 h-4 lg:w-5 lg:h-5 scale-[1.2]" />
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
                  className="text-black cursor-pointer hover:bg-gray-100 p-2 lg:p-3 transition-all duration-500 rounded-2xl whitespace-nowrap"
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
        className={modileHeaderStyle}
        style={{
          background:
            isHomePage || isScrolled
              ? ''
              : 'linear-gradient(to bottom, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)',
        }}
      >
        <div className="relative flex items-center justify-between px-4 h-full">
          {/* 왼쪽 - 뒤로가기 */}
          {!isHomePage ? (
            <button
              onClick={goBackWithTransitions}
              className="hover:bg-gray-100 rounded-md transition-colors z-10"
            >
              <ChevronLeft size={24} className="text-black" />
            </button>
          ) : (
            <div className="w-6 h-6" />
          )}

          {/* 로고 - 절대 중앙 */}
          <div className="absolute left-1/2 -translate-x-1/2 pt-1">
            {pathname === '/about' && (
              <Image
                src={`${AWS_S3_DOMAIN}images/logo/gwana_logo_1.webp`}
                alt="gwana_logo"
                width={120}
                height={120}
                onClick={() => router.push('/')}
                className="cursor-pointer"
                priority
              />
            )}
            {pathname !== '/about' && (
              <Image
                src={`${AWS_S3_DOMAIN}images/logo/gwana_logo_2.webp`}
                alt="gwana_logo"
                width={80}
                height={80}
                onClick={() => router.push('/')}
                className="cursor-pointer"
                priority
              />
            )}
          </div>

          {/* 우측 아이콘들 */}
          <div className="flex items-center space-x-6 z-10">
            <button
              className="relative py-2 hover:bg-gray-100/20 rounded-md transition-colors"
              onClick={() => router.push('/cart')}
            >
              <ShoppingCart
                size={20}
                className={`${isHomePage ? 'text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]' : 'text-black'}`}
              />
              {cartCount > 0 && (
                <span
                  className={`absolute top-[1px] flex items-center justify-center min-w-[16px] h-[16px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full ${cartCount > 99 ? 'right-[-5px]' : 'right-[-8px]'}`}
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
                size={22}
                className={`${isHomePage ? 'text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]' : 'text-black'}`}
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
