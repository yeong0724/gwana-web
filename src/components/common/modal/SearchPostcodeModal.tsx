'use client';

import { XIcon } from 'lucide-react';
import DaumPostcode, { Address } from 'react-daum-postcode';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SearchPostcodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (address: Address) => void;
}

const SearchPostcodeModal = ({ open, onOpenChange, onComplete }: SearchPostcodeModalProps) => {
  const handleComplete = (addressData: Address) => {
    onComplete(addressData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-lg h-[800px] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>주소찾기</DialogTitle>
          <DialogClose className="absolute top-3 right-3 p-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity">
            <XIcon className="size-6" />
          </DialogClose>
        </DialogHeader>
        <div className="flex-1 overflow-hidden outline-none focus:outline-none [&_*]:outline-none">
          <DaumPostcode style={{ width: '100%', height: '100%' }} onComplete={handleComplete} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchPostcodeModal;
