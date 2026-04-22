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
      {/* 사이드 네비게이션 */}
      <nav
        className="block w-72 bg-brand-50/60 fixed top-[60px] overflow-y-auto flex-shrink-0 border-r border-brand-200/40"
        style={{ height: 'calc(100vh - 60px)' }}
      >
        <div className="px-6 pt-10 pb-6">
          <p className="text-[11px] tracking-[0.15em] text-warm-400 uppercase mb-1">
            collection
          </p>
          <h2 className="text-[26px] font-bold text-brand-900 tracking-tight">티 제품</h2>
          <div className="w-10 h-[2px] bg-brand-700 mt-4" />
        </div>

        <div className="px-3 pb-8">
          {productCategory.map(({ menuId, menuName }) => (
            <button
              key={menuId}
              onClick={() => onClickCategory(menuId)}
              className={cn(
                'w-full px-4 py-3.5 transition-all duration-300 cursor-pointer text-left text-[15px] tracking-[-0.01em]',
                categoryId === menuId
                  ? 'text-brand-900 font-semibold bg-white/70 border-l-2 border-brand-700'
                  : 'text-brand-400 font-medium hover:text-brand-700 hover:bg-white/40 border-l-2 border-transparent'
              )}
            >
              {menuName}
            </button>
          ))}
        </div>
      </nav>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 min-w-0 ml-72 bg-warm-50">
        {/* 카테고리 헤더 */}
        <div className="px-8 pt-10 pb-6 border-b border-brand-200/30">
          <div className="flex items-center gap-2 text-[12px] text-warm-400 tracking-wide mb-3">
            <span>티 제품</span>
            <span className="text-brand-200">·</span>
            <span className="text-brand-600 font-medium">
              {find(productCategory, { menuId: categoryId })?.menuName}
            </span>
          </div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">
            {find(productCategory, { menuId: categoryId })?.menuName}
          </h1>
        </div>

        {/* 상품 그리드 */}
        <div className="relative overflow-hidden px-8 pt-8 pb-40">
          {currentCategory && (
            <div className={isTransitioning ? 'animate-tab-slide-left-in' : ''}>
              <div
                className={cn(
                  'grid grid-cols-2',
                  'lg:grid-cols-3',
                  'xl:grid-cols-4',
                  'gap-x-5 gap-y-12'
                )}
              >
                {map(productList, (product) => (
                  <div key={product.productId} className="w-full">
                    <ProductCard product={product} onClickProduct={onClickProduct} />
                  </div>
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
