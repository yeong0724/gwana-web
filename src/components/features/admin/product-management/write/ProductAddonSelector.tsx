'use client';

import { memo } from 'react';

import { Check, Tag } from 'lucide-react';

import { ProductAddon } from '@/types';

type Props = {
  allAddons: ProductAddon[];
  selectedIds: number[];
  onToggle: (addon: ProductAddon, checked: boolean) => void;
};

const formatKRW = (value: number) => `${value.toLocaleString('ko-KR')}원`;

const ProductAddonSelector = ({ allAddons, selectedIds, onToggle }: Props) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sm font-semibold tracking-tight text-warm-900">
            추가선택옵션(애드온)
          </h3>
          <span className="font-mono text-xs tabular-nums text-warm-500">
            {selectedIds.length.toString().padStart(2, '0')}
          </span>
        </div>
        <p className="text-xs text-warm-500">
          이 상품에 노출할 애드온을 선택하세요. 항목 추가·수정은 상단 &lsquo;애드온 관리&rsquo;에서
          합니다.
        </p>
      </div>

      {allAddons.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-warm-200 bg-white px-4 py-10 text-center">
          <Tag className="size-5 text-warm-400" strokeWidth={1.5} />
          <p className="text-sm font-medium text-warm-700">등록된 애드온이 없습니다</p>
          <p className="text-xs text-warm-500">&lsquo;애드온 관리&rsquo;에서 먼저 추가하세요</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {allAddons.map((addon) => {
            const checked = selectedIds.includes(addon.productAddonId);
            return (
              <button
                key={addon.productAddonId}
                type="button"
                onClick={() => onToggle(addon, !checked)}
                className={
                  checked
                    ? 'flex items-center gap-2 rounded-lg border border-warm-900 bg-warm-900 px-3.5 py-2.5 text-sm font-medium text-white transition-all active:translate-y-[1px]'
                    : 'flex items-center gap-2 rounded-lg border border-warm-200 bg-white px-3.5 py-2.5 text-sm font-medium text-warm-700 transition-all hover:border-warm-400 active:translate-y-[1px]'
                }
              >
                <span
                  className={
                    checked
                      ? 'flex size-4 items-center justify-center rounded-full bg-white/20'
                      : 'flex size-4 items-center justify-center rounded-full border border-warm-300'
                  }
                >
                  {checked && <Check className="size-3" strokeWidth={3} />}
                </span>
                <span>{addon.name}</span>
                <span
                  className={
                    checked
                      ? 'font-mono text-xs tabular-nums text-white/80'
                      : 'font-mono text-xs tabular-nums text-warm-500'
                  }
                >
                  +{formatKRW(addon.price)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default memo(ProductAddonSelector);
