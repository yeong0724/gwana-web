'use client';

import { memo } from 'react';

import { Plus, X } from 'lucide-react';

import { ProductOption } from '@/types';

type Props = {
  options: ProductOption[];
  onChange: (next: ProductOption[]) => void;
  onRemove: (option: ProductOption, index: number) => void;
  productId: string;
};

const formatKRWInput = (value: number) => (value === 0 ? '' : value.toLocaleString('ko-KR'));

const ProductOptionEditor = ({ options, onChange, onRemove, productId }: Props) => {
  const handleAdd = () => {
    const newOption: ProductOption = {
      productOptionId: null as unknown as string,
      productId,
      optionName: '',
      optionPrice: 0,
      isRequired: true,
      isQuantityAdjustable: true,
    };
    onChange([...options, newOption]);
  };

  const handleNameChange = (index: number, value: string) => {
    onChange(options.map((opt, i) => (i === index ? { ...opt, optionName: value } : opt)));
  };

  const handlePriceChange = (index: number, raw: string) => {
    const value = raw === '' ? 0 : Number(raw.replace(/[^0-9]/g, ''));
    onChange(options.map((opt, i) => (i === index ? { ...opt, optionPrice: value } : opt)));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-warm-900">옵션 관리</h3>
            <span className="font-mono text-xs tabular-nums text-warm-500">
              {options.length.toString().padStart(2, '0')}
            </span>
          </div>
          <p className="text-xs text-warm-500">상품에 노출되는 구매 옵션을 관리합니다.</p>
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

      {options.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-warm-200 bg-white px-4 py-12 text-center">
          <p className="text-sm font-medium text-warm-700">등록된 옵션이 없습니다</p>
          <p className="text-xs text-warm-500">우측 상단의 + 옵션 추가 버튼으로 추가하세요</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {options.map((option, index) => (
            <li
              key={option.productOptionId ?? `new-${index}`}
              className="flex flex-col gap-2 rounded-xl border border-warm-200 bg-white p-3 md:flex-row md:items-center md:gap-3"
            >
              <span className="font-mono text-[11px] tabular-nums tracking-wider text-warm-500 uppercase md:w-10">
                #{(index + 1).toString().padStart(2, '0')}
              </span>

              <input
                type="text"
                value={option.optionName}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder="옵션명 (예: 세작 80g)"
                className="h-11 w-full flex-1 rounded-lg border border-warm-200 bg-white px-3 text-[15px] text-warm-900 placeholder:text-warm-400 focus:border-warm-700 focus:outline-none focus:ring-2 focus:ring-warm-900/10"
              />

              <div className="relative w-full md:w-48">
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatKRWInput(option.optionPrice)}
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                  placeholder="0"
                  className="h-11 w-full rounded-lg border border-warm-200 bg-white pl-3 pr-9 text-right font-mono text-[15px] tabular-nums text-warm-900 placeholder:text-warm-300 focus:border-warm-700 focus:outline-none focus:ring-2 focus:ring-warm-900/10"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-warm-500">
                  원
                </span>
              </div>

              <button
                type="button"
                onClick={() => onRemove(option, index)}
                className="flex size-9 shrink-0 items-center justify-center self-end rounded-md text-warm-400 transition-colors hover:bg-warm-900 hover:text-white active:translate-y-[1px] md:self-auto"
                aria-label="옵션 삭제"
              >
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default memo(ProductOptionEditor);
