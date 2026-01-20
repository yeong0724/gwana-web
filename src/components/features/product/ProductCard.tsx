'use client';

import { Product } from '@/types';
import Image from 'next/image';

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
    <div
      className="bg-white cursor-pointer group"
      onClick={() => onClickProduct(product.productId)}
    >
      <Image
        src={images[0]}
        alt={`${product.productName} image`}
        width={600}
        height={600}
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {/* 상품 정보 */}
      <div className="flex flex-col pt-4 space-y-2 justify-center items-center">
        <h3 className="text-[14px] lg:text-[17px] font-semibold text-gray-800 leading-snug text-center break-keep">
          {product.productName}
        </h3>
        <div className="space-y-1">
          <p className="text-[12px] lg:text-[15px] text-gray-700">
            {formatPrice(product.price || 25000)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
