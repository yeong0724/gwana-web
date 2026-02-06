'use client';

import DaumPostcode, { Address } from 'react-daum-postcode';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

type Props = {
  addressOpen: boolean;
  setAddressOpen: (open: boolean) => void;
  handleAddressComplete: (address: Address) => void;
};

const SearchPostcodeSheet = ({ addressOpen, setAddressOpen, handleAddressComplete }: Props) => {
  return (
    <Sheet open={addressOpen} onOpenChange={setAddressOpen}>
      <SheetContent side="bottom" className="h-full">
        <SheetHeader className="border-b">
          <SheetTitle>주소찾기</SheetTitle>
        </SheetHeader>
        <DaumPostcode
          style={{ width: '100%', height: '100%' }}
          onComplete={handleAddressComplete}
        />
      </SheetContent>
    </Sheet>
  );
};

export default SearchPostcodeSheet;
