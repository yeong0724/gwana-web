import dynamic from 'next/dynamic';
import Image from 'next/image';

import { ChevronLeft, MenuIcon, ShoppingCart } from 'lucide-react';

import { AWS_S3_DOMAIN } from '@/constants';
import { useControllerContext, useStateContext } from '@/context/headerContext';

// SSR 비활성화로 import
const Navigation = dynamic(() => import('@/components/layout/Navigation'), {
  ssr: false,
});

const MobileMainHeader = () => {
  const { modileHeaderStyle, pathname, isScrolled, cartCount, menuGroup, isMenuOpen } =
    useStateContext();
  const { goBackWithTransitions, goHome, goToCartPage, toggleMenu, goToLoginPage } =
    useControllerContext();

  const isAboutPage = pathname === '/about';

  return (
    <>
      <header
        className={modileHeaderStyle}
        style={{
          background:
            isAboutPage || isScrolled
              ? ''
              : 'linear-gradient(to bottom, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 100%)',
        }}
      >
        <div className="relative flex items-center justify-between px-4 h-full">
          <button
            onClick={goBackWithTransitions}
            className="hover:bg-gray-100 rounded-md transition-colors z-10"
          >
            <ChevronLeft size={24} className="text-black" />
          </button>

          {/* 로고 - 절대 중앙 */}
          <div className="absolute left-1/2 -translate-x-1/2 pt-1">
            {pathname === '/about' && (
              <Image
                src={`${AWS_S3_DOMAIN}images/logo/gwana_logo_1.webp`}
                alt="gwana_logo"
                width={120}
                height={120}
                onClick={goHome}
                className="object-contain cursor-pointer"
                priority
              />
            )}
            {pathname !== '/about' && (
              <Image
                src={`${AWS_S3_DOMAIN}images/logo/gwana_logo_2.webp`}
                alt="gwana_logo"
                width={80}
                height={80}
                onClick={goHome}
                className="object-contain cursor-pointer"
                priority
              />
            )}
          </div>

          {/* 우측 아이콘들 */}
          <div className="flex items-center space-x-6 z-10">
            <button
              className="relative py-2 hover:bg-gray-100/20 rounded-md transition-colors"
              onClick={goToCartPage}
            >
              <ShoppingCart
                size={20}
                className={`${pathname === '/about' ? 'text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]' : 'text-black'}`}
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
                className={`${pathname === '/about' ? 'text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]' : 'text-black'}`}
              />
            </button>
          </div>
        </div>
      </header>
      <Navigation
        isMenuOpen={isMenuOpen}
        moveToLoginPage={goToLoginPage}
        toggleMenu={toggleMenu}
        menuGroup={menuGroup}
      />
    </>
  );
};

export default MobileMainHeader;
