'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { cloneDeep, filter, find } from 'lodash-es';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { OptionDropdown } from '@/components/common/form';
import { categoryOptions } from '@/constants/options';
import { asyncFn, compressImage } from '@/lib/utils';
import useProductService from '@/service/useProductService';
import useAlertStore from '@/stores/useAlertStore';
import { ProductDetailResponse } from '@/types/response';

import ProductImageManager from './ProductImageManager';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 3;

type Props = {
  productId: string;
};

const defaultValues: ProductDetailResponse = {
  productId: '',
  productName: '',
  categoryId: '',
  categoryName: '',
  images: [],
  infos: [],
  price: 0,
  shippingPrice: 0,
  options: [],
};

const ProductWriteContainer = ({ productId }: Props) => {
  const router = useRouter();
  const { showAlert } = useAlertStore();

  const {
    useProductDetailQuery,
    useUploadProductImagedMutation,
    useUpdateProductMutation,
    useDeleteProductImageMutation,
  } = useProductService();

  const [product, setProduct] = useState<ProductDetailResponse>({ ...defaultValues });

  const { data: productDetailData, error: productDetailError } = useProductDetailQuery({
    productId,
  });

  const { mutateAsync: uploadProductImageAsync } = useUploadProductImagedMutation();
  const { mutateAsync: updateProductAsync } = useUpdateProductMutation();
  const { mutateAsync: deleteProductImageAsync } = useDeleteProductImageMutation();

  useEffect(() => {
    if (productDetailData) {
      const { data } = productDetailData;
      const { options } = data;
      setProduct({ ...data, options: filter(options, (option) => !!option.productId) });
    } else if (productDetailError) {
      toast.error('상품 상세 정보를 불러오는데 실패하였습니다.');
    }
  }, [productDetailData, productDetailError]);

  const selectedCategoryLabel = useMemo(() => {
    const matched = find(categoryOptions, { value: product.categoryId });
    return matched?.label ?? product.categoryName ?? '';
  }, [product.categoryId, product.categoryName]);

  const handleTextChange = (key: 'productName') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleNumberChange =
    (key: 'price' | 'shippingPrice') => (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      const value = raw === '' ? 0 : Number(raw);
      setProduct((prev) => ({ ...prev, [key]: value }));
    };

  const handleCategorySelect = (value: string) => {
    const matched = find(categoryOptions, { value });
    setProduct((prev) => ({
      ...prev,
      categoryId: value,
      categoryName: matched?.label ?? prev.categoryName,
    }));
  };

  const handleReorder = (next: string[], name: 'images' | 'infos') => {
    const _product = cloneDeep(product);
    const reorderedProduct = { ..._product, [name]: next };

    updateProduct(reorderedProduct);
  };

  const handleImageRemove = async (imageUrl: string, name: 'images' | 'infos') => {
    const [error] = await asyncFn(deleteProductImageAsync({ imageUrl }));

    if (error) {
      toast.error('상품 이미지 삭제에 실패하였습니다.');
      return;
    }

    const _product = cloneDeep(product);
    const updatedProduct = {
      ..._product,
      [name]: _product[name].filter((url) => url !== imageUrl),
    };

    updateProduct(updatedProduct);
  };

  const handleImageUpload = async (file: File, folderPath: string, name: 'images' | 'infos') => {
    try {
      const compressedFile = await compressImage(file, { quality: 0.9 });

      // 확장자 검사
      if (!ALLOWED_FILE_TYPES.includes(compressedFile.type)) {
        showAlert({
          title: '업로드 불가',
          description: '허용된 확장자는 jpeg, png, webp 입니다.',
        });
        return;
      }

      // 용량 검사
      if (compressedFile.size > MAX_FILE_SIZE * 1024 * 1024) {
        showAlert({
          title: '업로드 불가',
          description: `업로드 가능한 용량은 ${MAX_FILE_SIZE}MB 이하입니다.`,
        });
        return;
      }

      const formData = new FormData();
      formData.append('folderPath', folderPath);
      formData.append('image', file);

      const [error, data] = await asyncFn(uploadProductImageAsync(formData));
      if (error) {
        toast.error('상품 이미지 업로드 실패');
        return;
      }

      const { data: imageUrl } = data;

      const _product = cloneDeep(product);
      const updatedProduct = { ..._product, [name]: [..._product[name], imageUrl] };
      updateProduct(updatedProduct);
    } catch (error) {
      console.error(error);
      toast.error('이미지 업로드에 실패하였습니다.');
    }
  };

  const updateProduct = async (updatedProduct: ProductDetailResponse) => {
    const [error] = await asyncFn(updateProductAsync(updatedProduct));
    if (error) {
      toast.error('상품 업데이트에 실패하였습니다.');
      return;
    } else {
      toast.success('상품 업데이트를 성공하였습니다.');
      setProduct(updatedProduct);
    }
  };

  const formatKRWInput = (value: number) => (value === 0 ? '' : value.toLocaleString('ko-KR'));

  return (
    <div className="min-h-[100dvh] bg-warm-50">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
        <header className="flex flex-col gap-4 border-b border-warm-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => router.push('/admin/product-management')}
              className="flex w-fit items-center gap-1.5 text-xs text-warm-500 transition-colors hover:text-warm-900"
            >
              <ArrowLeft className="size-3.5" strokeWidth={1.5} />
              <span className="font-mono tracking-wider uppercase">Back to list</span>
            </button>
            <span className="font-mono text-xs tracking-[0.18em] text-warm-500 uppercase">
              Admin · Product Edit
            </span>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-warm-900 md:text-4xl">
              상품 수정
            </h1>
            <p className="font-mono text-xs tracking-wider text-warm-400">ID · {productId}</p>
          </div>
        </header>

        <div className="mt-8 flex flex-col gap-6">
          <section className="flex flex-col gap-6">
            <FieldGroup label="상품명" hint="소비자에게 노출되는 상품 제목입니다.">
              <input
                type="text"
                value={product.productName}
                onChange={handleTextChange('productName')}
                placeholder="예) 우전 녹차 30g"
                className="h-12 w-full rounded-lg border border-warm-200 bg-white px-4 text-[15px] text-warm-900 placeholder:text-warm-400 focus:border-warm-700 focus:outline-none focus:ring-2 focus:ring-warm-900/10"
              />
            </FieldGroup>

            <FieldGroup label="카테고리" hint="상품이 속할 카테고리를 선택하세요.">
              <OptionDropdown
                options={categoryOptions}
                onOptionSelect={handleCategorySelect}
                placeholder={selectedCategoryLabel || '카테고리를 선택해주세요'}
              />
            </FieldGroup>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FieldGroup label="가격" hint="단위: 원">
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatKRWInput(product.price)}
                    onChange={handleNumberChange('price')}
                    placeholder="0"
                    className="h-12 w-full rounded-lg border border-warm-200 bg-white pl-4 pr-10 text-right font-mono text-[15px] tabular-nums text-warm-900 placeholder:text-warm-300 focus:border-warm-700 focus:outline-none focus:ring-2 focus:ring-warm-900/10"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-warm-500">
                    원
                  </span>
                </div>
              </FieldGroup>

              <FieldGroup label="배송비" hint="0원일 경우 무료배송으로 표시됩니다.">
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatKRWInput(product.shippingPrice)}
                    onChange={handleNumberChange('shippingPrice')}
                    placeholder="0"
                    className="h-12 w-full rounded-lg border border-warm-200 bg-white pl-4 pr-10 text-right font-mono text-[15px] tabular-nums text-warm-900 placeholder:text-warm-300 focus:border-warm-700 focus:outline-none focus:ring-2 focus:ring-warm-900/10"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-warm-500">
                    원
                  </span>
                </div>
              </FieldGroup>
            </div>
          </section>

          <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-warm-200 bg-white p-5">
              <ProductImageManager
                title="상품 이미지"
                description="썸네일 및 상품 목록에 노출되는 이미지입니다."
                images={product.images}
                onReorder={handleReorder}
                onRemove={handleImageRemove}
                onUpload={handleImageUpload}
                folderPath="images/product/thumbnail"
                name="images"
              />
            </div>

            <div className="rounded-2xl border border-warm-200 bg-white p-5">
              <ProductImageManager
                title="상품 상세 이미지"
                description="상세 페이지 하단에 노출되는 상세 설명 이미지입니다."
                images={product.infos}
                onReorder={handleReorder}
                onRemove={handleImageRemove}
                onUpload={handleImageUpload}
                folderPath="images/product/info"
                name="infos"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

type FieldGroupProps = {
  label: string;
  hint?: string;
  children: React.ReactNode;
};

const FieldGroup = ({ label, hint, children }: FieldGroupProps) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-warm-800">{label}</label>
    {children}
    {hint && <p className="text-xs text-warm-500">{hint}</p>}
  </div>
);

export default ProductWriteContainer;
