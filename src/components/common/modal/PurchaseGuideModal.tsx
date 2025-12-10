import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  moveToLoginPage: () => void;
};

const PurchaseGuideModal = ({ modalOpen, setModalOpen, moveToLoginPage }: Props) => {
  const onClose = () => {
    setModalOpen(false);
  };

  const onLogin = () => {
    moveToLoginPage();
    onClose();
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="[&_button[data-slot='dialog-close']]:cursor-pointer [&_button[data-slot='dialog-close']_svg]:size-[24px] min-h-[280px] flex flex-col sm:max-w-[400px]">
        <DialogHeader className="border-b-2 border-black pb-4 text-left">
          <DialogTitle>확인</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-[#018275] mb-3 font-light">구매를 위해 로그인이 필요합니다</div>
          <div>안전한 결제 처리를 위해</div>
          <div>로그인 후 구매를 진행해주세요.</div>
        </div>
        <DialogFooter className="flex-row justify-center gap-3 sm:flex-row mt-auto">
          <Button variant="outline" onClick={onClose} className="flex-1 cursor-pointer">
            취소
          </Button>
          <Button onClick={onLogin} variant="default" className="flex-1 cursor-pointer">
            로그인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseGuideModal;
