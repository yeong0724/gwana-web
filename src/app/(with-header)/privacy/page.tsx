import { Metadata } from 'next';

import { PrivacyBody } from '@/components/features/terms/terms-content';

export const metadata: Metadata = {
  title: '개인정보처리방침 | 관아수제차',
  description: '관아수제차 개인정보처리방침',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-[100dvh] bg-warm-50">
      <div className="mx-auto max-w-3xl px-5 py-10 md:py-20">
        {/* Header */}
        <header className="mb-8 md:mb-14">
          <p className="text-caption font-medium uppercase tracking-wide text-tea-600 mb-2">
            Privacy Policy
          </p>
          <h1 className="text-heading-1 md:text-display font-bold tracking-display text-brand-800 leading-tight">
            개인정보처리방침
          </h1>
          <div className="mt-4 h-px bg-gradient-to-r from-brand-300/60 to-transparent" />
          <div className="mt-2 text-body-sm text-warm-500">
            <p>시행일자: 2026년 4월 16일</p>
            <p>최종 개정일: 2026년 4월 16일</p>
          </div>
        </header>

        <PrivacyBody />
      </div>
    </main>
  );
}
