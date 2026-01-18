import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  onKakaoShare: () => void;
};

const ShareModal = ({ modalOpen, setModalOpen, onKakaoShare }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleKakaoShare = () => {
    onKakaoShare();
    setModalOpen(false);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setIsCopied(true);
      toast.success('URL이 복사되었습니다');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error('URL 복사에 실패했습니다');
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="[&_button[data-slot='dialog-close']]:cursor-pointer [&_button[data-slot='dialog-close']_svg]:size-[24px] min-h-[280px] flex flex-col sm:max-w-[400px]">
        <DialogHeader className="border-b-2 border-black pb-4 text-left">
          <DialogTitle>공유하기</DialogTitle>
        </DialogHeader>

        {/* 공유 옵션 영역 */}
        <div className="flex-1 flex flex-col items-center justify-center py-2">
          <div className="flex gap-6">
            {/* 카카오톡 */}
            <button
              onClick={handleKakaoShare}
              className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Image src="/images/kakao_logo.webp" alt="카카오톡" width={60} height={60} />
              <span className="text-sm text-gray-700">카카오톡</span>
            </button>

            {/* 추후 다른 공유 옵션 추가 가능 */}
          </div>
        </div>

        {/* URL 복사 영역 */}
        <div className="pt-1">
          <div className="flex items-stretch border border-gray-300 rounded-lg overflow-hidden">
            <div className="flex-1 bg-white px-4 py-3 min-w-0">
              <span className="text-sm text-blue-500 truncate block">{currentUrl}</span>
            </div>
            <button
              onClick={handleCopyUrl}
              className="flex-shrink-0 px-2 text-sm text-gray-500 bg-gray-100 border-l border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer flex items-center"
            >
              {isCopied ? (
                <>
                  <Check size={14} className="mr-1" />
                  복사됨
                </>
              ) : (
                'URL복사'
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
