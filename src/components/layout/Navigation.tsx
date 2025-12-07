import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { concat, filter, isEmpty } from 'lodash-es';
import { ChevronDown, User, X } from 'lucide-react';

import { useLoginStore } from '@/stores';
import { MenuGroup } from '@/types';

type Props = {
  isMenuOpen: boolean;
  moveToLoginPage: () => void;
  toggleMenu: () => void;
  menuGroup: MenuGroup;
};

const Navigation = ({ isMenuOpen, moveToLoginPage, toggleMenu, menuGroup }: Props) => {
  const { main, category } = menuGroup;
  const router = useRouter();
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
      router.push(`/${currentMenu}?category=${categoryId}`);
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
  const moveToOrderHistory = () => {};

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
        className={`fixed top-0 left-0 h-full w-[90%] bg-white z-[80] transform transition-transform duration-600 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-2xl flex flex-col`}
      >
        {/* 사이드바 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          {isLogin ? (
            <div className="flex items-center justify-center px-4 py-1 text-lg font-medium text-black min-w-[48px]">
              <User size={24} className="text-black-700" />
            </div>
          ) : (
            <button
              className="flex items-center text-lg font-medium text-black hover:text-gray-500 transition-colors cursor-pointer"
              onClick={moveToLoginPage}
            >
              <span className="font-bold">로그인</span>
              <ChevronDown size={20} className="text-gray-800 ml-2 rotate-[-90deg]" />
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

            {/* 하단 메뉴 - 플렉스로 바닥에 배치 (로그인 시에만 노출) */}
            <div className="flex-1" />
            {isLogin && (
              <div className="bg-gray-50 p-4 mx-4 rounded-lg mb-6 flex-shrink-0">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={moveToOrderHistory}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    <span className="text-sm text-gray-700">주문 조회</span>
                    <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                  >
                    <span className="text-sm text-gray-700">로그아웃</span>
                    <ChevronDown size={16} className="text-gray-400 rotate-[-90deg]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
