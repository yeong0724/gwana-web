import { useContext, useState } from 'react';

import { concat, filter, isEmpty } from 'lodash-es';
import { ChevronDown, Home, X } from 'lucide-react';

import { RouterWrapperContext } from '@/contexts/RouterWrapperContext';
import { useLoginStore } from '@/stores';
import { MenuGroup } from '@/types';

type Props = {
  isMenuOpen: boolean;
  moveToLoginPage: () => void;
  toggleMenu: () => void;
  menuGroup: MenuGroup;
};

const Navigation = ({ isMenuOpen, moveToLoginPage, toggleMenu, menuGroup }: Props) => {
  const { wrappedPush } = useContext(RouterWrapperContext);
  const { main, category } = menuGroup;
  const { isLogin } = useLoginStore();
  const [currentMenu, setCurrentMenu] = useState<string>('');

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
    }
  };

  const onClickCategory = (categoryId: string) => {
    if (currentMenu === 'product') {
      wrappedPush(`/${currentMenu}?category=${categoryId}`);
      closeSidebar();
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
   * 주문조회 이동
   */
  const moveToOrderHistory = () => {
    // wrappedPush('/order');
    closeSidebar();
  };

  /**
   * 장바구니 이동
   */
  const moveToCart = () => {
    wrappedPush('/cart');
    closeSidebar();
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-5 z-[70] transition-opacity duration-600 ${
          isMenuOpen ? 'opacity-30 visible' : 'opacity-0 invisible'
        }`}
      />

      {/* 사이드바 메뉴 */}
      <div
        className={`fixed top-0 left-0 h-full w-[90%] bg-white z-[1000] transform transition-transform duration-600 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl flex flex-col`}
      >
        {/* 사이드바 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <button
            onClick={() => {
              wrappedPush('/');
              closeSidebar();
            }}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            aria-label="홈으로 이동"
          >
            <Home size={24} className="text-gray-700" />
          </button>

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
                {isLogin ? (
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-black transition-colors cursor-pointer font-medium"
                  >
                    로그아웃
                  </button>
                ) : (
                  <button
                    onClick={moveToLoginPage}
                    className="text-gray-700 hover:text-black transition-colors cursor-pointer font-medium"
                  >
                    로그인
                  </button>
                )}
                <span className="text-gray-300 mx-5">|</span>
                <button
                  onClick={moveToCart}
                  className="text-gray-700 hover:text-black transition-colors cursor-pointer font-medium"
                >
                  장바구니
                </button>
                {isLogin && (
                  <>
                    <span className="text-gray-300 mx-5">|</span>
                    <button
                      onClick={moveToOrderHistory}
                      className="text-gray-700 hover:text-black transition-colors cursor-pointer font-medium"
                    >
                      마이페이지
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
