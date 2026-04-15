'use client';

import { Product } from '@/types';

type ProductCardProps = {
  product: Product;
  onClickProduct: (productId: string) => void;
};

const ProductCard = ({ product, onClickProduct }: ProductCardProps) => {
  const images = product.images || [];

  const formatPrice = (price?: number) => {
    if (!price) return '0원';
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  return (
    <button
      className="cursor-pointer group text-left row-span-3 grid grid-rows-subgrid gap-0"
      onClick={() => onClickProduct(product.productId)}
    >
      {/* 이미지 영역 */}
      <div className="relative overflow-hidden aspect-square">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[0]}
          alt={product.productName}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* 하단 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* 상품명 */}
      <h3 className="pt-3 text-[13px] lg:text-[16px] font-medium text-brand-800 leading-snug break-keep tracking-[-0.01em]">
        {product.productName}
      </h3>
      {/* 가격 */}
      <p className="mt-1 text-[13px] lg:text-[15px] text-brand-500 tabular-nums font-medium">
        {formatPrice(product.price || 25000)}
      </p>
    </button>
  );
};

export default ProductCard;
