'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { ChevronRight, Package, Search } from 'lucide-react';
import { toast } from 'sonner';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProductService } from '@/service';

const formatKRW = (value: number) => `${value.toLocaleString('ko-KR')}원`;

const ProductMgtListContainer = () => {
  const router = useRouter();
  const { useProductListQuery } = useProductService();
  const {
    data: productListData,
    error: productListError,
    isLoading,
  } = useProductListQuery({
    categoryId: '',
  });

  const productList = useMemo(() => productListData?.data ?? [], [productListData]);

  useEffect(() => {
    if (productListError) {
      toast.error('상품 상세 정보를 불러오는데 실패하였습니다.');
    }
  }, [productListError]);

  const onClickRow = (productId: string) => {
    router.push(`/admin/product-management/${productId}`);
  };

  return (
    <div className="min-h-[100dvh] bg-warm-50">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
        <header className="flex flex-col gap-3 border-b border-warm-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs tracking-[0.18em] text-warm-500 uppercase">
              Admin · Product Management
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-warm-900 md:text-4xl mt-3">
              상품 관리
            </h1>
          </div>
          <div className="flex items-center gap-6 text-sm text-warm-600">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-2xl font-semibold tabular-nums text-warm-900">
                {productList.length.toString().padStart(2, '0')}
              </span>
              <span className="text-xs tracking-wider text-warm-500 uppercase">Items</span>
            </div>
          </div>
        </header>

        <section className="mt-8 overflow-hidden rounded-2xl border border-warm-200 bg-white">
          <Table className="text-sm">
            <TableHeader>
              <TableRow className="border-warm-200 bg-warm-100/60 hover:bg-warm-100/60">
                <TableHead className="w-20 px-6 py-4 font-mono text-xs tracking-wider text-warm-500 uppercase">
                  No
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-medium tracking-wider text-warm-500 uppercase">
                  상품명
                </TableHead>
                <TableHead className="w-40 px-6 py-4 text-xs font-medium tracking-wider text-warm-500 uppercase">
                  카테고리
                </TableHead>
                <TableHead className="w-40 px-6 py-4 text-right text-xs font-medium tracking-wider text-warm-500 uppercase">
                  가격
                </TableHead>
                <TableHead className="w-40 px-6 py-4 text-right text-xs font-medium tracking-wider text-warm-500 uppercase">
                  배송비
                </TableHead>
                <TableHead className="w-12 px-6 py-4" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 6 }).map((_, idx) => (
                  <TableRow
                    key={`skeleton-${idx}`}
                    className="border-warm-200 hover:bg-transparent"
                  >
                    <TableCell className="px-6 py-5">
                      <div className="h-4 w-6 animate-pulse rounded bg-warm-200" />
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="h-4 w-48 animate-pulse rounded bg-warm-200" />
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="h-4 w-16 animate-pulse rounded bg-warm-200" />
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="ml-auto h-4 w-20 animate-pulse rounded bg-warm-200" />
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="ml-auto h-4 w-16 animate-pulse rounded bg-warm-200" />
                    </TableCell>
                    <TableCell className="px-6 py-5" />
                  </TableRow>
                ))}

              {!isLoading && productList.length === 0 && (
                <TableRow className="border-transparent hover:bg-transparent">
                  <TableCell colSpan={6} className="px-6 py-20">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="flex size-14 items-center justify-center rounded-full border border-warm-200 bg-warm-100">
                        <Package className="size-6 text-warm-500" strokeWidth={1.5} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-base font-medium text-warm-800">
                          등록된 상품이 없습니다
                        </p>
                        <p className="text-sm text-warm-500">
                          상품을 추가하면 이곳에 목록이 표시됩니다.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                productList.map((product, index) => {
                  const isFreeShipping = product.shippingPrice === 0;

                  return (
                    <TableRow
                      key={product.productId}
                      onClick={() => onClickRow(product.productId)}
                      className="group cursor-pointer border-warm-200 transition-colors hover:bg-warm-50 active:bg-warm-100"
                    >
                      <TableCell className="px-6 py-5 font-mono text-xs tabular-nums text-warm-500">
                        {(index + 1).toString().padStart(2, '0')}
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="font-medium text-warm-900 group-hover:text-brand-900">
                          {product.productName}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="inline-flex items-center rounded-full border border-warm-200 bg-warm-50 px-2.5 py-0.5 text-xs font-medium text-warm-700">
                          {product.categoryName}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-5 text-right font-mono tabular-nums text-warm-900">
                        {formatKRW(product.price)}
                      </TableCell>
                      <TableCell className="px-6 py-5 text-right">
                        {isFreeShipping ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-warm-900/10 bg-warm-900 px-2.5 py-1 text-xs font-medium tracking-tight text-white">
                            무료배송
                          </span>
                        ) : (
                          <span className="font-mono tabular-nums text-warm-700">
                            {formatKRW(product.shippingPrice)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-5 text-right">
                        <ChevronRight
                          className="ml-auto size-4 text-warm-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-warm-800"
                          strokeWidth={1.5}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </section>

        {!isLoading && !!productListError && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-warm-300 bg-warm-100 px-4 py-3 text-sm text-warm-700">
            <Search className="size-4 shrink-0" strokeWidth={1.5} />
            <span>상품 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductMgtListContainer;
