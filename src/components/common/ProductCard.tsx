'use client';

import { Star } from 'lucide-react';

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
      className="cursor-pointer group text-left"
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

      {/* 상품 정보 */}
      <div>
        <h3 className="pt-3 text-[13px] lg:text-[16px] font-medium text-brand-800 leading-snug break-keep tracking-[-0.01em]">
          {product.productName}
        </h3>
        <p className="mt-1 text-[13px] lg:text-[15px] text-brand-500 tabular-nums font-medium">
          {formatPrice(product.price || 25000)}
        </p>
        {/* 별점 · 리뷰 — TODO: API 연동 후 하드코딩 제거 */}
        <div className="mt-1.5 flex items-center gap-1">
          <Star className="w-3 h-3 text-gold-400 fill-gold-400 shrink-0 translate-y-[-0.5px]" />
          <span className="text-[12px] lg:text-[14px] leading-none text-brand-600 tabular-nums font-medium">
            {product.avgRating}
          </span>
          <span className="text-[12px] lg:text-[14px] leading-none text-warm-400">
            ({product.reviewCount})
          </span>
        </div>
      </div>
    </button>
  );
};

export default ProductCard;
