'use client';

import { useState } from 'react';

import { ChevronRight } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import useIsMobile from '@/hooks/useIsMobile';
import { SignupForm } from '@/types';

import TermsViewerModal from './TermsViewerModal';
import TermsViewerSheet from './TermsViewerSheet';

type Props = {
  onComplete: () => void;
};

type AgreementKey = 'agreeTerms' | 'agreePrivacy' | 'agreeAge14' | 'agreeMarketing';
type TermsType = 'terms' | 'privacy';

const StepAgreement = ({ onComplete }: Props) => {
  const { isMobile } = useIsMobile();
  const { setValue, watch } = useFormContext<SignupForm>();
  const [viewingTerms, setViewingTerms] = useState<TermsType | null>(null);

  const agreeTerms = watch('agreeTerms');
  const agreePrivacy = watch('agreePrivacy');
  const agreeAge14 = watch('agreeAge14');
  const agreeMarketing = watch('agreeMarketing');

  const allChecked = agreeTerms && agreePrivacy && agreeAge14 && agreeMarketing;
  const canProceed = agreeTerms && agreePrivacy && agreeAge14;

  const setAgreement = (key: AgreementKey, checked: boolean) => {
    setValue(key, checked, { shouldValidate: false, shouldDirty: true });
  };

  const handleAllChange = (checked: boolean) => {
    setAgreement('agreeTerms', checked);
    setAgreement('agreePrivacy', checked);
    setAgreement('agreeAge14', checked);
    setAgreement('agreeMarketing', checked);
  };

  const handleProceed = () => {
    if (!canProceed) return;
    onComplete();
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* 약관 동의 영역 */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 max-w-[500px] w-full mx-auto">
        {/* 전체 동의 */}
        <label className="flex items-center gap-3 px-4 py-4 rounded-xl bg-brand-50 border border-brand-200/50 cursor-pointer">
          <Checkbox
            checked={allChecked}
            onCheckedChange={(v) => handleAllChange(Boolean(v))}
            className="size-5"
          />
          <span className="text-[15px] font-bold text-brand-800">전체 동의</span>
        </label>

        {/* 개별 항목 */}
        <div className="mt-4 space-y-1">
          <AgreementRow
            checked={agreeTerms}
            onChange={(v) => setAgreement('agreeTerms', v)}
            required
            label="이용약관 동의"
            onViewDetail={() => setViewingTerms('terms')}
          />
          <AgreementRow
            checked={agreePrivacy}
            onChange={(v) => setAgreement('agreePrivacy', v)}
            required
            label="개인정보 수집 및 이용 동의"
            onViewDetail={() => setViewingTerms('privacy')}
          />
          <AgreementRow
            checked={agreeAge14}
            onChange={(v) => setAgreement('agreeAge14', v)}
            required
            label="만 14세 이상입니다"
          />
          <AgreementRow
            checked={agreeMarketing}
            onChange={(v) => setAgreement('agreeMarketing', v)}
            label="마케팅 수신 동의"
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex-shrink-0 bg-white p-4 border-t border-brand-200/60 flex justify-center">
        <button
          type="button"
          onClick={handleProceed}
          disabled={!canProceed}
          className={`w-full rounded-full py-3.5 text-[15px] font-semibold flex items-center justify-center gap-2 transition-all max-w-[500px] ${
            canProceed
              ? 'bg-brand-800 hover:bg-brand-900 text-white active:scale-[0.98] cursor-pointer'
              : 'bg-warm-200 text-warm-400 cursor-not-allowed'
          }`}
        >
          <span>회원가입 진행</span>
        </button>
      </div>

      {/* 약관 상세 보기 - Modal (웹) / Sheet (모바일) */}
      {viewingTerms !== null &&
        (isMobile ? (
          <TermsViewerSheet
            open={true}
            onOpenChange={(open) => !open && setViewingTerms(null)}
            type={viewingTerms}
          />
        ) : (
          <TermsViewerModal
            open={true}
            onOpenChange={(open) => !open && setViewingTerms(null)}
            type={viewingTerms}
          />
        ))}
    </div>
  );
};

export default StepAgreement;

/* ─── 개별 동의 항목 ─── */

function AgreementRow({
  checked,
  onChange,
  required = false,
  label,
  onViewDetail,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  label: string;
  onViewDetail?: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
        <Checkbox
          checked={checked}
          onCheckedChange={(v) => onChange(Boolean(v))}
          className="size-[18px] shrink-0"
        />
        <span className="text-[14px] text-warm-700">
          <span className={`mr-1 ${required ? 'text-red-400' : 'text-warm-400'}`}>
            {required ? '[필수]' : '[선택]'}
          </span>
          {label}
        </span>
      </label>
      {onViewDetail && (
        <button
          type="button"
          onClick={onViewDetail}
          className="shrink-0 ml-2 text-warm-400 hover:text-warm-600 transition-colors cursor-pointer"
        >
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  );
}
