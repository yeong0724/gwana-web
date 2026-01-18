'use client';

import { useLoginStore } from '@/stores';
import { MenuGroup } from '@/types';
import { concat, filter, isEmpty } from 'lodash-es';
import { ChevronDown, ChevronRight, LogOut, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  isMenuOpen: boolean;
  moveToLoginPage: () => void;
  toggleMenu: () => void;
  menuGroup: MenuGroup;
};

const Navigation = ({ isMenuOpen, moveToLoginPage, toggleMenu, menuGroup }: Props) => {
  const router = useRouter();
  const { main, category } = menuGroup;
  const { isLogin, user } = useLoginStore();

  const [currentMenu, setCurrentMenu] = useState<string>('');

  // 사이드바 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const getFilteredCategory = (menuId: string) => {
    const init =
      menuId === 'product'
        ? [{ menuName: '전체 상품 보기', menuId: 'all', upperMenuId: null }]
        : [];
    return concat(init, filter(category, { upperMenuId: menuId }));
  };

  const onClickMain = (menuId: string, hasCategory: boolean) => {
    if (hasCategory) {
      setCurrentMenu((prev) => (prev === menuId ? '' : menuId));
    } else {
      router.push(`/${menuId}`);
      closeSidebar();
    }
  };

  const onClickCategory = (categoryId: string) => {
    if (currentMenu === 'product') {
      closeSidebar();
      router.push(`/${currentMenu}?category=${categoryId}`);
    }
  };

  const closeSidebar = () => {
    toggleMenu();
    setCurrentMenu('');
  };

  /**
   * 로그아웃
   */
  const handleLogout = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/oauth2/logout/kakao`;
  };

  /**
   * 장바구니 이동
   */
  const moveToCart = () => {
    router.push('/cart');
    closeSidebar();
  };

  const moveToHome = () => {
    router.push('/');
    closeSidebar();
  };

  return createPortal(
    <>
      {/* 오버레이 */}
      <div
        style={{ viewTransitionName: 'navigation-overlay' }}
        className={`fixed inset-0 bg-gray-800 bg-opacity-5 z-[70] transition-opacity duration-600 ${
          isMenuOpen ? 'opacity-30 visible' : 'opacity-0 invisible'
        }`}
      />

      {/* 사이드바 메뉴 */}
      <div
        style={{ viewTransitionName: 'navigation-sidebar' }}
        className={`fixed top-0 left-0 h-full w-[90%] bg-white z-[1000] transform transition-transform duration-600 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* 사이드바 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          {isLogin ? (
            <button
              onClick={moveToHome}
              className="flex items-center hover:bg-gray-100 rounded-md transition-colors cursor-pointer p-2"
              aria-label="홈으로 이동"
            >
              <User size={26} className="text-gray-900 mr-3" />
              <span className="text-[18px] font-semibold">{user?.username}</span>
              <span className="text-[18px] ml-[2px]">님</span>
            </button>
          ) : (
            <button
              onClick={moveToLoginPage}
              className="flex items-center hover:bg-gray-100 rounded-md transition-colors cursor-pointer p-2"
              aria-label="홈으로 이동"
            >
              <span className="text-[18px] font-semibold mr-[2px]">로그인</span>
              <ChevronRight size={22} className="text-gray-800" />
            </button>
          )}

          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            aria-label="메뉴 닫기"
          >
            <X size={24} className="text-gray-700" />
          </button>
        </div>

        {/* 메뉴 아이템들 */}
        <div className="flex-1 overflow-y-auto sidebar-scroll min-h-0">
          <div className="flex flex-col min-h-full">
            <div className="py-2 flex-shrink-0">
              {main.map(({ menuId, menuName }) => {
                const filteredCategory = getFilteredCategory(menuId);
                const hasCategory = !isEmpty(filteredCategory);

                return (
                  <div key={menuId} className="border-b border-gray-100 last:border-b-0">
                    <button
                      className={`w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer transition-colors ${currentMenu === menuId ? 'transition-colors' : ''}`}
                      onClick={() => onClickMain(menuId, hasCategory)}
                    >
                      <span className="text-base font-medium text-gray-900">{menuName}</span>
                      {hasCategory && (
                        <ChevronDown
                          size={20}
                          className={`text-gray-400 transition-transform duration-600 ${
                            currentMenu === menuId ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>
                    {/* 서브메뉴 */}
                    {hasCategory && (
                      <div
                        className={`bg-amber-50/30 overflow-hidden transition-all duration-600 ease-in-out ${
                          currentMenu === menuId ? 'max-h-48' : 'max-h-0'
                        }`}
                      >
                        {filteredCategory.map((category, subIndex) => (
                          <button
                            key={subIndex}
                            className="w-full text-left px-8 py-3 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer bg-gray-100 "
                            onClick={() => onClickCategory(category.menuId)}
                          >
                            {category.menuName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 하단 메뉴 - 심플 텍스트 버튼 스타일 */}
            <div className="flex-1" />
            <div className="py-6 px-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-center gap-0 text-sm tracking-wide">
                <button
                  onClick={moveToHome}
                  className="text-gray-700 hover:text-black transition-colors cursor-pointer font-medium"
                >
                  Home
                </button>
                <span className="text-gray-300 mx-5">|</span>
                <button
                  onClick={moveToCart}
                  className="text-gray-700 hover:text-black transition-colors cursor-pointer font-medium"
                >
                  오시는길
                </button>
                {isLogin && (
                  <>
                    <span className="text-gray-300 mx-5">|</span>
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-black transition-colors cursor-pointer font-medium flex items-center gap-1"
                    >
                      <LogOut size={16} />
                      로그아웃
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default Navigation;
