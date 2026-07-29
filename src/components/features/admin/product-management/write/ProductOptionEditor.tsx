'use client';

import { memo, useRef } from 'react';

import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical, ImagePlus, Plus, X } from 'lucide-react';

import { AWS_S3_DOMAIN } from '@/constants/env';
import { ProductVariant } from '@/types';

// 드래그 재정렬/리스트 key 안정화용 클라이언트 키. 신규는 clientId, 기존은 variant id 기반.
const variantKey = (v: ProductVariant) => v.clientId ?? `v-${v.productVariantId}`;
const genClientId = () => `c-${Date.now()}-${Math.random().toString(36).slice(2)}`;

type Props = {
  variants: ProductVariant[];
  onChange: (next: ProductVariant[]) => void;
  onRemove: (variant: ProductVariant, index: number) => void;
  // 옵션별 썸네일 업로드/제거 (등록·수정 공통)
  onThumbnailUpload?: (file: File, index: number) => void;
  onThumbnailRemove?: (index: number) => void;
  productId: number;
};

const formatKRWInput = (value: number) => (value === 0 ? '' : value.toLocaleString('ko-KR'));

const ProductOptionEditor = ({
  variants,
  onChange,
  onRemove,
  onThumbnailUpload,
  onThumbnailRemove,
  productId,
}: Props) => {
  const handleAdd = () => {
    const newVariant: ProductVariant = {
      productVariantId: null as unknown as number,
      productId,
      optionLabel: '',
      price: 0,
      status: 'ON_SALE',
      sortOrder: variants.length,
      thumbnailUrl: null,
      clientId: genClientId(),
    };
    onChange([...variants, newVariant]);
  };

  const handleLabelChange = (index: number, value: string) => {
    onChange(variants.map((v, i) => (i === index ? { ...v, optionLabel: value } : v)));
  };

  const handlePriceChange = (index: number, raw: string) => {
    const value = raw === '' ? 0 : Number(raw.replace(/[^0-9]/g, ''));
    onChange(variants.map((v, i) => (i === index ? { ...v, price: value } : v)));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-warm-900">옵션(판매단위) 관리</h3>
            <span className="font-mono text-xs tabular-nums text-warm-500">
              {variants.length.toString().padStart(2, '0')}
            </span>
          </div>
          <p className="text-xs text-warm-500">
            상품에 노출되는 구매 옵션(variant)을 관리합니다. 드래그로 순서를 변경할 수 있습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-lg border border-warm-300 bg-white px-3 py-2 text-xs font-medium text-warm-700 transition-all hover:border-warm-700 hover:bg-warm-900 hover:text-white active:translate-y-[1px]"
        >
          <Plus className="size-3.5" strokeWidth={2} />
          <span>옵션 추가</span>
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-warm-200 bg-white px-4 py-12 text-center">
          <p className="text-sm font-medium text-warm-700">등록된 옵션이 없습니다</p>
          <p className="text-xs text-warm-500">우측 상단의 + 옵션 추가 버튼으로 추가하세요</p>
        </div>
      ) : (
        <Reorder.Group axis="y" values={variants} onReorder={onChange} className="flex flex-col gap-2">
          {variants.map((variant, index) => (
            <VariantRow
              key={variantKey(variant)}
              variant={variant}
              index={index}
              onLabelChange={handleLabelChange}
              onPriceChange={handlePriceChange}
              onRemove={onRemove}
              onThumbnailUpload={onThumbnailUpload}
              onThumbnailRemove={onThumbnailRemove}
            />
          ))}
        </Reorder.Group>
      )}
    </div>
  );
};

type VariantRowProps = {
  variant: ProductVariant;
  index: number;
  onLabelChange: (index: number, value: string) => void;
  onPriceChange: (index: number, raw: string) => void;
  onRemove: (variant: ProductVariant, index: number) => void;
  onThumbnailUpload?: (file: File, index: number) => void;
  onThumbnailRemove?: (index: number) => void;
};

const VariantRow = ({
  variant,
  index,
  onLabelChange,
  onPriceChange,
  onRemove,
  onThumbnailUpload,
  onThumbnailRemove,
}: VariantRowProps) => {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={variant}
      dragListener={false}
      dragControls={controls}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileDrag={{ scale: 1.01, boxShadow: '0 14px 28px -12px rgba(0,0,0,0.16)', zIndex: 10 }}
      className="flex flex-col gap-2 rounded-xl border border-warm-200 bg-white p-3 md:flex-row md:items-center md:gap-3"
    >
      <div className="flex items-center gap-2 md:gap-3">
        <button
          type="button"
          onPointerDown={(event) => controls.start(event)}
          className="flex size-7 shrink-0 cursor-grab items-center justify-center rounded-md text-warm-400 transition-colors hover:bg-warm-100 hover:text-warm-700 active:cursor-grabbing"
          aria-label="순서 변경"
        >
          <GripVertical className="size-4" strokeWidth={1.5} />
        </button>

        <span className="font-mono text-[11px] tabular-nums tracking-wider text-warm-500 uppercase md:w-8">
          #{(index + 1).toString().padStart(2, '0')}
        </span>

        <VariantThumbnail
          url={variant.thumbnailUrl}
          onUpload={(file) => onThumbnailUpload?.(file, index)}
          onRemove={() => onThumbnailRemove?.(index)}
        />
      </div>

      <input
        type="text"
        value={variant.optionLabel}
        onChange={(e) => onLabelChange(index, e.target.value)}
        placeholder="옵션명 (예: 세작 80g)"
        className="h-11 w-full flex-1 rounded-lg border border-warm-200 bg-white px-3 text-[15px] text-warm-900 placeholder:text-warm-400 focus:border-warm-700 focus:outline-none focus:ring-2 focus:ring-warm-900/10"
      />

      <div className="relative w-full md:w-48">
        <input
          type="text"
          inputMode="numeric"
          value={formatKRWInput(variant.price ?? 0)}
          onChange={(e) => onPriceChange(index, e.target.value)}
          placeholder="0"
          className="h-11 w-full rounded-lg border border-warm-200 bg-white pl-3 pr-9 text-right font-mono text-[15px] tabular-nums text-warm-900 placeholder:text-warm-300 focus:border-warm-700 focus:outline-none focus:ring-2 focus:ring-warm-900/10"
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-warm-500">
          원
        </span>
      </div>

      <button
        type="button"
        onClick={() => onRemove(variant, index)}
        className="flex size-9 shrink-0 items-center justify-center self-end rounded-md text-warm-400 transition-colors hover:bg-warm-900 hover:text-white active:translate-y-[1px] md:self-auto"
        aria-label="옵션 삭제"
      >
        <X className="size-4" strokeWidth={1.5} />
      </button>
    </Reorder.Item>
  );
};

type VariantThumbnailProps = {
  url: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
};

const VariantThumbnail = ({ url, onUpload, onRemove }: VariantThumbnailProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = '';
    }
  };

  return (
    <div className="relative size-16 shrink-0 self-end md:self-auto">
      {url ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${AWS_S3_DOMAIN}${url}`}
            alt="옵션 썸네일"
            className="size-16 rounded-lg border border-warm-200 bg-warm-100 object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-warm-900 text-white shadow-sm transition-colors hover:bg-warm-700"
            aria-label="썸네일 제거"
          >
            <X className="size-3" strokeWidth={2} />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex size-16 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-warm-300 bg-warm-50 text-warm-500 transition-colors hover:border-warm-500 hover:text-warm-700"
          aria-label="옵션 썸네일 추가"
        >
          <ImagePlus className="size-4" strokeWidth={1.5} />
          <span className="text-[10px]">썸네일</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

export default memo(ProductOptionEditor);
