const ProductSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-5 md:gap-y-10">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 h-80 animate-pulse"
        >
          {/* 상품 이미지 스켈레톤 */}
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>

          {/* 상품 제목 스켈레톤 */}
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* 가격 스켈레톤 */}
          <div className="h-5 bg-gray-200 rounded w-1/3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
