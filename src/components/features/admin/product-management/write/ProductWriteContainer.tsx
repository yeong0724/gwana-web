'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { find, some } from 'lodash-es';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

import { OptionDropdown } from '@/components/common/form';
import { categoryOptions } from '@/constants/options';
import { asyncFn, compressImage } from '@/lib/utils';
import useProductService from '@/service/useProductService';
import useAlertStore from '@/stores/useAlertStore';
import {
  ProductAddon,
  ProductDetailResponse,
  ProductStatus,
  ProductUpdateRequest,
  ProductVariant,
} from '@/types';

import ProductAddonSelector from './ProductAddonSelector';
import ProductImageManager from './ProductImageManager';
import ProductOptionEditor from './ProductOptionEditor';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 3;

// 등록·수정 모두 새 이미지는 temp 에 올려두고, 저장 시 백엔드가 실폴더로 이동한다.
// (버려진 temp 는 S3 lifecycle 이 청소. 수정 시 기존 실 이미지는 그대로 유지)
const TEMP_GALLERY_FOLDER = 'temp/product/thumbnail';
const TEMP_DETAIL_FOLDER = 'temp/product/info';
const TEMP_VARIANT_THUMB_FOLDER = 'temp/product/variant';

type Props = {
  productId: string;
};

type ImageKind = 'gallery' | 'detail';

const emptyProduct: ProductDetailResponse = {
  productId: 0,
  name: '',
  categoryId: 0,
  categoryName: '',
  summary: null,
  detailContent: null,
  status: ProductStatus.ON_SALE,
  shippingPrice: 0,
  displayPrice: 0,
  galleryImages: [],
  detailImages: [],
  variants: [],
  addons: [],
  avgRating: 0,
  reviewCount: 0,
};

const ProductWriteContainer = ({ productId }: Props) => {
  const router = useRouter();
  const { showAlert, showConfirmAlert } = useAlertStore();

  const {
    useAdminProductDetailQuery,
    useProductAddonsQuery,
    useUploadProductImagedMutation,
    useCreateProductMutation,
    useUpdateProductMutation,
  } = useProductService();

  // URL 파라미터(?productId=)가 있으면 기존 상품 수정, 없으면 신규 등록.
  const isEditingExisting = !!productId;
  const productIdNum = Number(productId) || 0;

  const [product, setProduct] = useState<ProductDetailResponse>({
    ...emptyProduct,
    productId: productIdNum,
  });

  const { data: productDetailData, error: productDetailError } = useAdminProductDetailQuery(
    { productId: productIdNum },
    { enabled: isEditingExisting }
  );

  const { data: addonsData } = useProductAddonsQuery();
  const allAddons = useMemo(() => addonsData?.data ?? [], [addonsData]);
  const selectedAddonIds = useMemo(
    () => product.addons.map((a) => a.productAddonId),
    [product.addons]
  );

  const { mutateAsync: createProductAsync } = useCreateProductMutation();
  const { mutateAsync: updateProductAsync } = useUpdateProductMutation();
  const { mutateAsync: uploadProductImageAsync } = useUploadProductImagedMutation();

  useEffect(() => {
    if (productDetailData?.data) {
      setProduct(productDetailData.data);
    } else if (productDetailError) {
      toast.error('상품 상세 정보를 불러오는데 실패하였습니다.');
    }
  }, [productDetailData, productDetailError]);

  const selectedCategoryLabel = useMemo(() => {
    const matched = find(categoryOptions, { value: String(product.categoryId) });
    return matched?.label ?? product.categoryName ?? '';
  }, [product.categoryId, product.categoryName]);

  // variant 유효성 — optionLabel 누락 / price === 0 존재 여부
  const optionValidation = useMemo(() => {
    const hasEmptyName = some(product.variants, (v) => !v.optionLabel);
    const hasZeroPrice = some(product.variants, (v) => !v.price);
    return {
      hasEmptyName,
      hasZeroPrice,
      hasError: hasEmptyName || hasZeroPrice,
    };
  }, [product.variants]);

  // 저장 payload — 등록/수정 공통. 옵션 sortOrder 는 현재 배열 index 로 재계산해서 보낸다.
  const buildRequest = (): ProductUpdateRequest => ({
    productId: isEditingExisting ? productIdNum : undefined,
    categoryId: product.categoryId,
    name: product.name,
    summary: product.summary,
    detailContent: product.detailContent,
    status: isEditingExisting ? undefined : ProductStatus.ON_SALE,
    shippingPrice: product.shippingPrice,
    variants: product.variants.map((v, i) => ({
      productVariantId: v.productVariantId ?? null,
      optionLabel: v.optionLabel,
      price: v.price,
      status: v.status,
      sortOrder: i,
      thumbnailUrl: v.thumbnailUrl,
    })),
    galleryUrls: product.galleryImages,
    detailUrls: product.detailImages,
    addonIds: product.addons.map((a) => a.productAddonId),
  });

  const imageField = (name: ImageKind): 'galleryImages' | 'detailImages' =>
    name === 'gallery' ? 'galleryImages' : 'detailImages';

  const uploadFolder = (name: ImageKind): string =>
    name === 'gallery' ? TEMP_GALLERY_FOLDER : TEMP_DETAIL_FOLDER;

  // 이미지 압축·검증·업로드 공통 처리. 성공 시 S3 키, 실패 시 null (안내 알럿 포함).
  const uploadImageFile = async (file: File, folder: string): Promise<string | null> => {
    try {
      const compressedFile = await compressImage(file, { quality: 0.9 });

      if (!ALLOWED_FILE_TYPES.includes(compressedFile.type)) {
        showAlert({ title: '업로드 불가', description: '허용된 확장자는 jpeg, png, webp 입니다.' });
        return null;
      }
      if (compressedFile.size > MAX_FILE_SIZE * 1024 * 1024) {
        showAlert({
          title: '업로드 불가',
          description: `업로드 가능한 용량은 ${MAX_FILE_SIZE}MB 이하입니다.`,
        });
        return null;
      }

      const formData = new FormData();
      formData.append('folderPath', folder);
      formData.append('image', compressedFile);

      const [error, data] = await asyncFn(
        uploadProductImageAsync(formData),
        `상품 이미지 업로드 실패 [${(compressedFile.size / (1024 * 1024)).toFixed(2)} MB]`
      );
      if (error) return null;
      return data.data;
    } catch (error) {
      console.error(error);
      toast.error('이미지 압축에 실패하였습니다.');
      return null;
    }
  };

  const handleTextChange = (key: 'name') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleNumberChange = (key: 'shippingPrice') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const value = raw === '' ? 0 : Number(raw);
    setProduct((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategorySelect = (value: string) => {
    const matched = find(categoryOptions, { value });
    setProduct((prev) => ({
      ...prev,
      categoryId: Number(value),
      categoryName: matched?.label ?? prev.categoryName,
    }));
  };

  // 이미지 순서변경/삭제/추가 — 모두 로컬 상태만 갱신. 서버 반영은 저장 시 일괄.
  const handleReorder = (next: string[], name: ImageKind) => {
    setProduct((prev) => ({ ...prev, [imageField(name)]: next }));
  };

  const handleImageRemove = (imageUrl: string, name: ImageKind) => {
    const field = imageField(name);
    setProduct((prev) => ({
      ...prev,
      [field]: prev[field].filter((url) => url !== imageUrl),
    }));
  };

  const handleImageUpload = async (file: File, folderPath: string, name: ImageKind) => {
    const url = await uploadImageFile(file, folderPath);
    if (!url) return;

    const field = imageField(name);
    setProduct((prev) => ({ ...prev, [field]: [...prev[field], url] }));
  };

  const handleVariantsChange = (next: ProductVariant[]) => {
    setProduct((prev) => ({ ...prev, variants: next }));
  };

  const handleVariantRemove = (_variant: ProductVariant, index: number) => {
    // 로컬에서만 제거. 저장 시 백엔드가 "목록에 없는 기존 옵션"을 soft delete 한다.
    setProduct((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  };

  const handleVariantThumbnailUpload = async (file: File, index: number) => {
    const url = await uploadImageFile(file, TEMP_VARIANT_THUMB_FOLDER);
    if (!url) return;

    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === index ? { ...v, thumbnailUrl: url } : v)),
    }));
  };

  const handleVariantThumbnailRemove = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === index ? { ...v, thumbnailUrl: null } : v)),
    }));
  };

  const handleAddonToggle = (addon: ProductAddon, checked: boolean) => {
    setProduct((prev) => {
      const rest = prev.addons.filter((a) => a.productAddonId !== addon.productAddonId);
      return { ...prev, addons: checked ? [...rest, addon] : rest };
    });
  };

  // 저장 필수 검증. 통과하면 null, 실패하면 안내 메시지.
  const getValidationMessage = (): string | null => {
    if (!product.name) return '상품명을 입력해주세요.';
    if (!product.categoryId) return '카테고리를 선택해주세요.';
    if (product.variants.length === 0) return '옵션(판매단위)을 1개 이상 추가해주세요.';
    if (optionValidation.hasEmptyName) return '옵션명을 모두 입력해주세요.';
    if (optionValidation.hasZeroPrice) return '옵션 가격을 입력해주세요.';
    return null;
  };

  // 이미지 업로드 가드: 필수값을 채우기 전에는 업로드 불가(temp 누적 방지) + 안내.
  const guardImageUpload = (): boolean => {
    const message = getValidationMessage();
    if (message) {
      showAlert({ title: '입력 확인', description: message });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const message = getValidationMessage();
    if (message) {
      showAlert({ title: '입력 확인', description: message });
      return;
    }

    const confirm = await showConfirmAlert({
      title: '안내',
      description: isEditingExisting ? '상품을 저장하시겠습니까?' : '상품을 등록하시겠습니까?',
      confirmText: isEditingExisting ? '저장' : '등록',
      cancelText: '취소',
    });
    if (!confirm) return;

    const payload = buildRequest();
    const [error] = isEditingExisting
      ? await asyncFn(updateProductAsync(payload), '상품 저장에 실패하였습니다.')
      : await asyncFn(createProductAsync(payload), '상품 등록에 실패하였습니다.');
    if (error) return;

    toast.success(isEditingExisting ? '상품이 저장되었습니다.' : '상품이 등록되었습니다.');
    router.back();
  };

  const formatKRWInput = (value: number) => (!value ? '' : value.toLocaleString('ko-KR'));

  return (
    <div className="min-h-[100dvh] bg-warm-50">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-10 md:px-8 md:py-14">
        <header className="flex flex-col gap-4 border-b border-warm-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-warm-900 md:text-4xl">
              {isEditingExisting ? '상품 수정' : '상품 등록'}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-warm-900 px-6 text-sm font-semibold tracking-tight text-white transition-all hover:bg-warm-800 active:translate-y-[1px] md:w-auto"
          >
            <Check className="size-4" strokeWidth={2} />
            <span>{isEditingExisting ? '저장하기' : '등록하기'}</span>
          </button>
        </header>

        <div className="mt-8 flex flex-col gap-6">
          <section className="flex flex-col gap-6">
            <FieldGroup label="상품명" hint="소비자에게 노출되는 상품 제목입니다.">
              <input
                type="text"
                value={product.name}
                onChange={handleTextChange('name')}
                placeholder="예) 우전 녹차 30g"
                className="h-12 w-full rounded-lg border border-warm-200 bg-white px-4 text-[15px] text-warm-900 placeholder:text-warm-400 focus:border-warm-700 focus:outline-none focus:ring-2 focus:ring-warm-900/10"
              />
            </FieldGroup>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FieldGroup label="카테고리" hint="상품이 속할 카테고리를 선택하세요.">
                <OptionDropdown
                  options={categoryOptions}
                  onOptionSelect={handleCategorySelect}
                  placeholder={selectedCategoryLabel || '카테고리를 선택해주세요'}
                />
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

          <section className="rounded-2xl border border-warm-200 bg-white p-5">
            <ProductOptionEditor
              variants={product.variants}
              onChange={handleVariantsChange}
              onRemove={handleVariantRemove}
              onThumbnailUpload={handleVariantThumbnailUpload}
              onThumbnailRemove={handleVariantThumbnailRemove}
              productId={productIdNum}
            />
          </section>

          <section className="rounded-2xl border border-warm-200 bg-white p-5">
            <ProductAddonSelector
              allAddons={allAddons}
              selectedIds={selectedAddonIds}
              onToggle={handleAddonToggle}
            />
          </section>

          <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-warm-200 bg-white p-5">
              <ProductImageManager
                title="상품 이미지 (갤러리)"
                description="썸네일 및 상품 목록에 노출되는 이미지입니다."
                images={product.galleryImages}
                onReorder={handleReorder}
                onRemove={handleImageRemove}
                onUpload={handleImageUpload}
                guardUpload={guardImageUpload}
                folderPath={uploadFolder('gallery')}
                name="gallery"
              />
            </div>

            <div className="rounded-2xl border border-warm-200 bg-white p-5">
              <ProductImageManager
                title="상품 상세 이미지"
                description="상세 페이지 하단에 노출되는 상세 설명 이미지입니다."
                images={product.detailImages}
                onReorder={handleReorder}
                onRemove={handleImageRemove}
                onUpload={handleImageUpload}
                guardUpload={guardImageUpload}
                folderPath={uploadFolder('detail')}
                name="detail"
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
