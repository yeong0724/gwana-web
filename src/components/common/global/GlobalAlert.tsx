// src/components/common/GlobalAlertDialog.tsx
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { alertStore } from '@/stores/useAlertStore';
import { useMemo } from 'react';

const GlobalAlert = () => {
  const {
    isOpen,
    title,
    description,
    confirmText,
    cancelText,
    size,
    confirmAlert,
    cancelAlert,
    hideAlert,
    type,
  } = alertStore();

  const alertSize = useMemo(() => {
    switch (size) {
      case 'sm':
        return '!max-w-sm';
      case 'md':
        return '!max-w-md';
      case 'lg':
        return '!max-w-lg';
      case 'xl':
        return '!max-w-2xl';
      default:
        return '!max-w-md';
    }
  }, [size]);

  const handleConfirm = () => {
    if (type === 'CONFIRM') {
      confirmAlert();
    } else {
      hideAlert();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={() => hideAlert()}>
      <AlertDialogContent className={alertSize}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="min-h-[30px]">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleConfirm} className="rounded-[10px]">
            {confirmText}
          </AlertDialogAction>
          {type === 'CONFIRM' && cancelText && (
            <AlertDialogCancel onClick={cancelAlert} className="rounded-[10px]">
              {cancelText || '취소'}
            </AlertDialogCancel>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GlobalAlert;
