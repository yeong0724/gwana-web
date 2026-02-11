import { find, map } from 'lodash-es';

import { ProductCard } from '@/components/common';
import { useControllerContext, useStateContext } from '@/context/productContext';
import { cn } from '@/lib/utils';

const ProductWebView = () => {
  const { productCategory, categoryId, currentCategory, isTransitioning, productList } =
    useStateContext();

  const { onClickCategory, onClickProduct } = useControllerContext();

  return (
    <>
      <nav
        className="block w-80 bg-white fixed top-[60px] overflow-y-auto flex-shrink-0"
        style={{ height: 'calc(100vh - 80px)' }}
      >
        {/* 네비 헤더 - 스티키 */}
        <div className="bg-white z-10 px-5 py-7">
          <h2 className="text-[28px] font-bold text-gray-900">티 제품</h2>
          <div className="w-[98%] h-px bg-gray-800 mt-3" />
        </div>

        {/* 메뉴 리스트 */}
        <div className="py-[5px]">
          {productCategory.map(({ menuId, menuName }) => (
            <div key={menuId} className="mb-1">
              {/* 2뎁스 메뉴 */}
              <button
                onClick={() => onClickCategory(menuId)}
                className={cn(
                  'w-full px-5 py-4 transition-all duration-500 cursor-pointer flex items-center justify-between',
                  'font-bold text-left text-[20px] text-black hover:text-green-800',
                  'bg-white hover:bg-gray-100',
                  categoryId === menuId ? 'text-green-800' : 'text-black'
                )}
              >
                <span>{menuName}</span>
              </button>
            </div>
          ))}
        </div>
      </nav>
      {/* 메인 컨텐츠 영역 - 나머지 공간 차지 */}
      <div className="flex-1 px-[15px] pt-[10px] pb-40 min-w-0 ml-80 bg-white">
        <div className="mb-6">
          <div className="text-gray-700 pl-[5px] mb-2 text-[15px]">
            <span className="mr-[10px]">티 제품</span>
            {`>`}
            <span className="mx-[10px] font-bold text-[15px]">
              {find(productCategory, { menuId: categoryId })?.menuName}
            </span>
          </div>
        </div>
        {/* ProductList - 동시 슬라이드 애니메이션 */}
        <div className="relative overflow-hidden">
          {/* 들어오는 리스트 (현재 카테고리) */}
          {currentCategory && (
            <div className={isTransitioning ? 'animate-tab-slide-left-in' : ''}>
              <div
                className={cn(
                  'grid grid-cols-2',
                  'lg:grid-cols-3',
                  'xl:grid-cols-4',
                  'gap-x-4 gap-y-10'
                )}
              >
                {map(productList, (product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    onClickProduct={onClickProduct}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductWebView;
