import Image from 'next/image';

import { filter, isEmpty } from 'lodash-es';
import { ShoppingCart, User } from 'lucide-react';

import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AWS_S3_DOMAIN } from '@/constants';
import { useControllerContext, useStateContext } from '@/context/headerContext';
import { Menu } from '@/types';

import UserDropdownContent from '../UserDropdownContent';

const WebMainHeader = () => {
  const {
    isHeaderHovered,
    isMainHovered,
    menuGroup,
    isScrolled,
    main,
    category,
    cartCount,
    isLoggedIn,
  } = useStateContext();

  const {
    setIsHeaderHovered,
    setIsMainHovered,
    onClickMain,
    onClickCategory,
    goHome,
    goToCartPage,
    goToLoginPage,
    goToMyPage,
    goToOrderHistoryPage,
    handleLogout,
  } = useControllerContext();

  return (
    <header
      className="block sticky h-[60px] top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background:
          isScrolled || isHeaderHovered
            ? '#ffffff'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0) 100%)',
        boxShadow:
          isScrolled || isHeaderHovered
            ? '0 4px 20px -4px rgba(0,0,0,0.06)'
            : 'none',
      }}
      onMouseEnter={() => setIsHeaderHovered(true)}
      onMouseLeave={() => {
        setIsHeaderHovered(false);
        setIsMainHovered(false);
      }}
    >
      {/* 카테고리 배경 영역 */}
      <div
        className={`absolute left-0 right-0 top-full bg-warm-50 border-t border-brand-200/40 shadow-lg shadow-brand-900/5 transition-all duration-300 ease-out origin-top z-10 ${
          isHeaderHovered && isMainHovered
            ? 'scale-y-100 opacity-100 visible'
            : 'scale-y-0 opacity-0 invisible'
        }`}
        style={{ height: '180px' }}
      />

      <div className="mx-auto px-6 relative z-20 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex flex-1 min-w-0">
            <a
              className="flex items-center flex-shrink-0 cursor-pointer pl-8"
              onClick={goHome}
              aria-label="홈으로 이동"
            >
              <Image
                src={`${AWS_S3_DOMAIN}images/logo/gwana_logo_2.webp`}
                alt="관아수제차"
                width={120}
                height={80}
                priority
              />
            </a>

            <nav
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
                    <button
                      className="cursor-pointer flex items-center justify-center text-[18px] text-brand-800 space-x-1 py-6 font-medium tracking-wide hover:text-brand-500 transition-colors duration-200 w-full"
                      onClick={() => onClickMain(menuId)}
                      onMouseEnter={() => {
                        if (!isEmpty(categories)) setIsMainHovered(true);
                      }}
                      onMouseLeave={() => setIsMainHovered(false)}
                    >
                      <span>{menuName}</span>
                    </button>

                    {/* 카테고리 드롭다운 */}
                    <div
                      className={`absolute top-full pt-5 flex flex-col items-center space-y-3 z-30 transition-all duration-300 ease-out origin-top ${
                        isHeaderHovered && isMainHovered
                          ? 'scale-y-100 opacity-100 visible'
                          : 'scale-y-0 opacity-0 invisible'
                      }`}
                      onMouseEnter={() => setIsMainHovered(true)}
                    >
                      {categories.map((category) => (
                        <button
                          key={category.menuId}
                          className="cursor-pointer mb-[20px] text-[18px] text-warm-600 hover:text-brand-600 transition-colors duration-200 whitespace-nowrap text-center"
                          onClick={() => onClickCategory(menuId, category.menuId)}
                        >
                          {category.menuName}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center flex-shrink-0 space-x-1 lg:space-x-8">
            <button
              className="relative text-brand-800 cursor-pointer hover:text-brand-500 transition-colors duration-200 p-3 lg:p-4 xl:p-5 mr-[30px]"
              onClick={goToCartPage}
              aria-label="장바구니"
            >
              <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 scale-[1.2]" />
              <span
                className={`absolute top-[6px] flex items-center justify-center min-w-[20px] h-[20px] px-1 bg-destructive text-white text-[12px] font-bold rounded-full ${cartCount > 99 ? 'right-[-5px]' : 'right-[5px]'}`}
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            </button>
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="text-brand-800 cursor-pointer hover:text-brand-500 transition-colors duration-200 p-3 lg:p-4 xl:p-5"
                    aria-label="사용자 메뉴"
                  >
                    <User className="w-4 h-4 lg:w-5 lg:h-5 scale-[1.2]" />
                  </button>
                </DropdownMenuTrigger>
                <UserDropdownContent
                  handleLogout={handleLogout}
                  moveToMyPage={goToMyPage}
                  moveToOrderHistory={goToOrderHistoryPage}
                />
              </DropdownMenu>
            ) : (
              <button
                className="text-brand-700 cursor-pointer hover:bg-brand-100 px-4 py-2 transition-all duration-200 rounded-lg whitespace-nowrap"
                onClick={goToLoginPage}
              >
                <span className="font-semibold text-sm lg:text-base">로그인</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default WebMainHeader;
