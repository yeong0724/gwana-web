'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { concat, filter, isEmpty } from 'lodash-es';
import { ChevronDown, ChevronRight, LogOut, User, X } from 'lucide-react';
import { createPortal } from 'react-dom';

import { useLoginStore, useUserStore } from '@/stores';
import { Menu, MenuGroup, RoleEnum } from '@/types';

type Props = {
  isMenuOpen: boolean;
  moveToLoginPage: () => void;
  toggleMenu: () => void;
  menuGroup: MenuGroup;
};

const Navigation = ({ isMenuOpen, moveToLoginPage, toggleMenu, menuGroup }: Props) => {
  const router = useRouter();
  const { main, category } = menuGroup;
  const { isLoggedIn } = useLoginStore();
  const { user } = useUserStore();

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
    const init: Menu[] =
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
      router.push(`/${currentMenu}?category=${categoryId}`);
    } else {
      router.push(`/${currentMenu}/${categoryId}`);
    }

    closeSidebar();
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
  const moveToMyPage = () => {
    router.push('/mypage');
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
        className={`fixed inset-0 bg-brand-900 z-[70] transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-30 visible' : 'opacity-0 invisible'
        }`}
      />

      {/* 사이드바 메뉴 */}
      <div
        style={{ viewTransitionName: 'navigation-sidebar' }}
        className={`fixed top-0 left-0 h-full w-[90%] bg-warm-50 z-[1000] transform transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* 사이드바 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-brand-200/60 flex-shrink-0">
          {isLoggedIn ? (
            <button
              onClick={moveToMyPage}
              className="flex items-center hover:bg-brand-100 rounded-lg transition-colors duration-200 cursor-pointer p-2"
              aria-label="마이페이지로 이동"
            >
              <User size={34} className="text-brand-700 mr-4" />
              <div className="flex flex-col items-start">
                {user.role === RoleEnum.ADMIN ? (
                  <span className="text-[16px] font-semibold text-brand-900">
                    {user?.username} <span className="text-[16px] text-warm-500">[관리자]</span>
                  </span>
                ) : (
                  <>
                    <span className="text-[16px] font-semibold text-brand-900">
                      {user?.username} 님
                    </span>
                    <span className="text-[14px] text-warm-500">{user?.email}</span>
                  </>
                )}
              </div>
            </button>
          ) : (
            <button
              onClick={moveToLoginPage}
              className="flex items-center hover:bg-brand-100 rounded-lg transition-colors duration-200 cursor-pointer p-2"
              aria-label="로그인 페이지로 이동"
            >
              <span className="text-[18px] font-semibold text-brand-800 mr-[2px]">로그인</span>
              <ChevronRight size={22} className="text-brand-600" />
            </button>
          )}

          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-brand-100 rounded-lg transition-colors duration-200 cursor-pointer"
            aria-label="메뉴 닫기"
          >
            <X size={24} className="text-warm-600" />
          </button>
        </div>

        {/* 메뉴 아이템들 */}
        <div className="flex-1 overflow-y-auto sidebar-scroll min-h-0">
          <div className="flex flex-col min-h-full">
            <div className="py-2 flex-shrink-0">
              {main
                .filter(
                  ({ isAdminMenu }) =>
                    !isAdminMenu || (isAdminMenu && user?.role === RoleEnum.ADMIN)
                )
                .map(({ menuId, menuName }) => {
                  const filteredCategory = getFilteredCategory(menuId);
                  const hasCategory = !isEmpty(filteredCategory);

                  return (
                    <div key={menuId} className="border-b border-brand-200/40 last:border-b-0">
                      <button
                        className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer transition-colors duration-200 hover:bg-brand-50"
                        onClick={() => onClickMain(menuId, hasCategory)}
                      >
                        <span className="text-base font-medium text-brand-800">{menuName}</span>
                        {hasCategory && (
                          <ChevronDown
                            size={20}
                            className={`text-warm-400 transition-transform duration-300 ${
                              currentMenu === menuId ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </button>
                      {/* 서브메뉴 */}
                      {hasCategory && (
                        <div
                          className={`bg-brand-50/50 overflow-hidden transition-all duration-300 ease-out ${
                            currentMenu === menuId ? 'max-h-48' : 'max-h-0'
                          }`}
                        >
                          {filteredCategory.map((category, subIndex) => (
                            <button
                              key={subIndex}
                              className="w-full text-left px-8 py-3 text-warm-700 hover:bg-brand-100 hover:text-brand-700 transition-colors duration-200 cursor-pointer"
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

            {/* 하단 메뉴 */}
            <div className="flex-1" />
            <div className="py-6 px-4 border-t border-brand-200/60 flex-shrink-0">
              <div className="flex items-center justify-center gap-0 text-sm tracking-wide">
                <button
                  onClick={moveToHome}
                  className="text-warm-600 hover:text-brand-700 transition-colors duration-200 cursor-pointer font-medium"
                >
                  Home
                </button>

                {isLoggedIn && (
                  <>
                    <span className="text-brand-200 mx-5">|</span>
                    <button
                      onClick={moveToMyPage}
                      className="text-warm-600 hover:text-brand-700 transition-colors duration-200 cursor-pointer font-medium"
                    >
                      마이페이지
                    </button>
                    <span className="text-brand-200 mx-5">|</span>
                    <button
                      onClick={handleLogout}
                      className="text-warm-600 hover:text-brand-700 transition-colors duration-200 cursor-pointer font-medium flex items-center gap-1"
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
