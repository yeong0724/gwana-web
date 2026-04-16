'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

import TermsViewerContent, { TERMS_TITLE } from './TermsViewerContent';

type TermsType = 'terms' | 'privacy' | 'identity';

interface TermsViewerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: TermsType;
}

const TermsViewerSheet = ({ open, onOpenChange, type }: TermsViewerSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-full flex flex-col">
        <SheetHeader className="border-b shrink-0">
          <SheetTitle className="text-[16px]">{TERMS_TITLE[type]}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <TermsViewerContent type={type} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TermsViewerSheet;
