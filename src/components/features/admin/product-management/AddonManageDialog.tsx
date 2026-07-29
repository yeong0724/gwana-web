'use client';

import { useEffect, useMemo, useState } from 'react';

import { Check, Pencil, Plus, Tag, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { asyncFn } from '@/lib/utils';
import useProductService from '@/service/useProductService';
import useAlertStore from '@/stores/useAlertStore';
import { ProductAddon } from '@/types';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Draft = {
  name: string;
  price: string;
};

const emptyDraft: Draft = { name: '', price: '' };

const parsePrice = (value: string) => Number(value.replace(/[^0-9]/g, '')) || 0;
const formatKRW = (value: number) => `${value.toLocaleString('ko-KR')}원`;

const AddonManageDialog = ({ open, onOpenChange }: Props) => {
  const { showConfirmAlert } = useAlertStore();
  const {
    useProductAddonsQuery,
    useCreateProductAddonMutation,
    useUpdateProductAddonMutation,
    useDeleteProductAddonMutation,
  } = useProductService();

  const { data, refetch, isLoading } = useProductAddonsQuery({ enabled: open });
  const addons = useMemo(() => data?.data ?? [], [data]);

  const { mutateAsync: createAsync } = useCreateProductAddonMutation();
  const { mutateAsync: updateAsync } = useUpdateProductAddonMutation();
  const { mutateAsync: deleteAsync } = useDeleteProductAddonMutation();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(emptyDraft);
  const [newDraft, setNewDraft] = useState<Draft>(emptyDraft);

  useEffect(() => {
    if (!open) {
      setEditingId(null);
      setEditDraft(emptyDraft);
      setNewDraft(emptyDraft);
    }
  }, [open]);

  const validate = (draft: Draft) => {
    if (!draft.name.trim()) {
      toast.error('애드온명을 입력해주세요.');
      return false;
    }
    if (parsePrice(draft.price) <= 0) {
      toast.error('추가금은 1원 이상이어야 합니다.');
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validate(newDraft)) return;
    const [error] = await asyncFn(
      createAsync({
        name: newDraft.name.trim(),
        price: parsePrice(newDraft.price),
      }),
      '애드온 등록에 실패하였습니다.'
    );
    if (error) return;
    toast.success('애드온을 등록했습니다.');
    setNewDraft(emptyDraft);
    refetch();
  };

  const startEdit = (addon: ProductAddon) => {
    setEditingId(addon.productAddonId);
    setEditDraft({ name: addon.name, price: String(addon.price) });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(emptyDraft);
  };

  const handleUpdate = async () => {
    if (editingId == null) return;
    if (!validate(editDraft)) return;
    const [error] = await asyncFn(
      updateAsync({
        productAddonId: editingId,
        name: editDraft.name.trim(),
        price: parsePrice(editDraft.price),
      }),
      '애드온 수정에 실패하였습니다.'
    );
    if (error) return;
    toast.success('애드온을 수정했습니다.');
    cancelEdit();
    refetch();
  };

  const handleDelete = async (addon: ProductAddon) => {
    const confirm = await showConfirmAlert({
      title: '애드온 삭제',
      description: `'${addon.name}' 애드온을 삭제하시겠습니까?`,
      confirmText: '삭제',
      cancelText: '취소',
    });
    if (!confirm) return;
    const [error] = await asyncFn(
      deleteAsync({ productAddonId: addon.productAddonId }),
      '애드온 삭제에 실패하였습니다.'
    );
    if (error) return;
    toast.success('애드온을 삭제했습니다.');
    refetch();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-[560px]">
        <DialogHeader className="border-b border-warm-200 px-6 py-5 text-left">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-warm-900">
            <Tag className="size-5 text-warm-500" strokeWidth={1.75} />
            애드온 관리
          </DialogTitle>
          <p className="mt-1 text-sm text-warm-500">
            추가선택옵션으로 상품에 얹을 수 있는 항목을 관리합니다.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* 새 애드온 추가 */}
          <div className="mb-5 rounded-xl border border-dashed border-warm-300 bg-warm-50 p-4">
            <p className="mb-3 text-xs font-semibold tracking-wider text-warm-500 uppercase">
              새 애드온
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                value={newDraft.name}
                onChange={(e) => setNewDraft((p) => ({ ...p, name: e.target.value }))}
                placeholder="예) 선물용 쇼핑백"
                className="h-10 flex-1 rounded-lg border border-warm-200 bg-white px-3 text-sm text-warm-900 placeholder:text-warm-400 focus:border-warm-700 focus:outline-none focus:ring-2 focus:ring-warm-900/10"
              />
              <div className="relative sm:w-32">
                <input
                  type="text"
                  inputMode="numeric"
                  value={newDraft.price}
                  onChange={(e) =>
                    setNewDraft((p) => ({ ...p, price: e.target.value.replace(/[^0-9]/g, '') }))
                  }
                  placeholder="0"
                  className="h-10 w-full rounded-lg border border-warm-200 bg-white pl-3 pr-7 text-right font-mono text-sm tabular-nums text-warm-900 placeholder:text-warm-300 focus:border-warm-700 focus:outline-none focus:ring-2 focus:ring-warm-900/10"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-warm-500">
                  원
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end">
              <button
                type="button"
                onClick={handleCreate}
                className="flex h-9 items-center gap-1.5 rounded-lg bg-warm-900 px-3.5 text-sm font-semibold text-white transition-all hover:bg-warm-800 active:translate-y-[1px]"
              >
                <Plus className="size-4" strokeWidth={2} />
                추가
              </button>
            </div>
          </div>

          {/* 애드온 목록 */}
          {isLoading && <p className="py-8 text-center text-sm text-warm-500">불러오는 중…</p>}

          {!isLoading && addons.length === 0 && (
            <p className="py-8 text-center text-sm text-warm-500">등록된 애드온이 없습니다.</p>
          )}

          <ul className="flex flex-col gap-2">
            {addons.map((addon) => {
              const isEditing = editingId === addon.productAddonId;

              return (
                <li
                  key={addon.productAddonId}
                  className="rounded-xl border border-warm-200 bg-white p-3"
                >
                  {isEditing ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input
                          type="text"
                          value={editDraft.name}
                          onChange={(e) => setEditDraft((p) => ({ ...p, name: e.target.value }))}
                          className="h-10 flex-1 rounded-lg border border-warm-200 bg-white px-3 text-sm text-warm-900 focus:border-warm-700 focus:outline-none focus:ring-2 focus:ring-warm-900/10"
                        />
                        <div className="relative sm:w-32">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={editDraft.price}
                            onChange={(e) =>
                              setEditDraft((p) => ({
                                ...p,
                                price: e.target.value.replace(/[^0-9]/g, ''),
                              }))
                            }
                            className="h-10 w-full rounded-lg border border-warm-200 bg-white pl-3 pr-7 text-right font-mono text-sm tabular-nums text-warm-900 focus:border-warm-700 focus:outline-none focus:ring-2 focus:ring-warm-900/10"
                          />
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-warm-500">
                            원
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="flex h-9 items-center gap-1 rounded-lg border border-warm-200 px-3 text-sm font-medium text-warm-600 transition-colors hover:bg-warm-50"
                          >
                            <X className="size-4" strokeWidth={2} />
                            취소
                          </button>
                          <button
                            type="button"
                            onClick={handleUpdate}
                            className="flex h-9 items-center gap-1 rounded-lg bg-warm-900 px-3 text-sm font-semibold text-white transition-all hover:bg-warm-800 active:translate-y-[1px]"
                          >
                            <Check className="size-4" strokeWidth={2} />
                            저장
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="truncate font-medium text-warm-900">{addon.name}</span>
                        <span className="font-mono text-sm tabular-nums text-warm-600">
                          + {formatKRW(addon.price)}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(addon)}
                          aria-label="수정"
                          className="flex size-9 items-center justify-center rounded-lg text-warm-500 transition-colors hover:bg-warm-100 hover:text-warm-800"
                        >
                          <Pencil className="size-4" strokeWidth={1.75} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(addon)}
                          aria-label="삭제"
                          className="flex size-9 items-center justify-center rounded-lg text-warm-500 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="size-4" strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddonManageDialog;
