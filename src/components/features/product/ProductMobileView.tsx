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
    <div className="flex-1 pb-40 min-w-0 lg:ml-80 bg-warm-50">
      {/* 카테고리 탭 */}
      <div className="sticky top-[48px] bg-white/80 backdrop-blur-md z-10 border-b border-brand-200/50">
        <nav
          ref={categoryTabScroll.scrollRef}
          className="flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing relative px-4"
          {...categoryTabScroll.dragHandlers}
        >
          {map(productCategory, ({ menuId, menuName }) => (
            <button
              key={menuId}
              data-category-id={menuId}
              className={cn(
                'py-4 px-5 min-w-fit',
                'cursor-pointer transition-all duration-300 flex-shrink-0',
                'text-[13px] text-center tracking-wide',
                categoryId === menuId
                  ? 'text-brand-900 font-semibold'
                  : 'text-warm-400 font-medium'
              )}
              onClick={() => onClickCategory(menuId)}
            >
              {menuName}
            </button>
          ))}
          {/* 탭 밑줄 인디케이터 */}
          {(() => {
            const activeIndex = findIndex(productCategory, ({ menuId }) => menuId === categoryId);
            const buttons = categoryTabScroll.scrollRef.current?.querySelectorAll('button');
            if (buttons && buttons[activeIndex]) {
              const btn = buttons[activeIndex] as HTMLElement;
              return (
                <div
                  className="absolute bottom-0 h-[2px] bg-brand-800 transition-all duration-300 ease-out"
                  style={{
                    width: `${btn.offsetWidth}px`,
                    left: `${btn.offsetLeft}px`,
                  }}
                />
              );
            }
            return (
              <div
                className="absolute bottom-0 h-[2px] bg-brand-800 transition-all duration-300 ease-out"
                style={{
                  width: '80px',
                  left: `${16 + activeIndex * 80}px`,
                }}
              />
            );
          })()}
        </nav>
      </div>

      {/* 현재 카테고리 라벨 */}
      <div className="px-4 pt-6 pb-5">
        <p className="text-[11px] tracking-widest text-warm-400 uppercase">
          tea collection
        </p>
        <h2 className="text-[20px] font-bold text-brand-900 mt-0.5 tracking-tight">
          {find(productCategory, { menuId: categoryId })?.menuName}
        </h2>
      </div>

      {/* 상품 그리드 */}
      <div className="relative overflow-hidden px-4">
        {currentCategory && (
          <div className={isTransitioning ? 'animate-tab-slide-left-in' : ''}>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8" style={{ gridTemplateRows: 'repeat(auto-fill, auto auto auto)' }}>
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
