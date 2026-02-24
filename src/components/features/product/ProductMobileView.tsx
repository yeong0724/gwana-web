import { find, findIndex, map } from 'lodash-es';

import { ProductCard } from '@/components/common';
import { useControllerContext, useStateContext } from '@/context/productContext';
import { cn } from '@/lib/utils';

const ProductMobileView = () => {
  const {
    categoryTabScroll,
    productCategory,
    categoryId,
    currentCategory,
    isTransitioning,
    productList,
  } = useStateContext();
  const { onClickCategory, onClickProduct } = useControllerContext();

  return (
    <div className="flex-1 px-[15px] pb-40 min-w-0 lg:ml-80 bg-white">
      <div className="sticky top-[48px] -mx-[15px] bg-white z-10 mb-5">
        <nav
          ref={categoryTabScroll.scrollRef}
          className="flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing relative px-[15px]"
          {...categoryTabScroll.dragHandlers}
        >
          {map(productCategory, ({ menuId, menuName }) => (
            <button
              key={menuId}
              data-category-id={menuId}
              className={cn(
                'py-[10px]',
                'cursor-pointer w-[100px] font-medium transition-colors duration-300 flex-shrink-0',
                'text-[13px] text-center',
                categoryId === menuId ? 'text-black' : 'text-gray-500'
              )}
              onClick={() => onClickCategory(menuId)}
            >
              {menuName}
            </button>
          ))}
          {/* 탭 밑줄 인디케이터 - nav 안쪽에서 스크롤과 함께 이동 */}
          <div
            className="absolute bottom-0 h-[2px] bg-black transition-all duration-300 ease-out"
            style={{
              width: '100px',
              left: `${15 + findIndex(productCategory, ({ menuId }) => menuId === categoryId) * 100}px`,
            }}
          />
        </nav>
        {/* 하단 배경 라인 */}
        <div className="h-[2px] bg-gray-200" />
      </div>
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
        {currentCategory && (
          <div className={isTransitioning ? 'animate-tab-slide-left-in' : ''}>
            <div className="grid grid-cols-2 gap-x-[16px] gap-y-10">
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
  );
};

export default ProductMobileView;
