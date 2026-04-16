'use client';

import { XIcon } from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import TermsViewerContent, { TERMS_TITLE } from './TermsViewerContent';

type TermsType = 'terms' | 'privacy' | 'identity';

interface TermsViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: TermsType;
}

const TermsViewerModal = ({ open, onOpenChange, type }: TermsViewerModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg h-[80vh] flex flex-col p-0 gap-0"
      >
        <DialogHeader className="p-4 border-b shrink-0">
          <DialogTitle className="text-[16px]">{TERMS_TITLE[type]}</DialogTitle>
          <DialogClose className="absolute top-3 right-3 p-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity">
            <XIcon className="size-6" />
          </DialogClose>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-5">
          <TermsViewerContent type={type} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsViewerModal;
