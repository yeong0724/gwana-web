import { Metadata } from 'next';

import { TermsBody } from '@/components/features/terms/terms-content';

export const metadata: Metadata = {
  title: '이용약관 | 관아수제차',
  description: '관아수제차 이용약관 및 환불정책',
};

export default function TermsPage() {
  return (
    <main className="min-h-[100dvh] bg-warm-50">
      <div className="mx-auto max-w-3xl px-5 py-12 md:py-20">
        {/* Header */}
        <header className="mb-10 md:mb-14">
          <p className="text-caption font-medium uppercase tracking-wide text-tea-600 mb-2">
            Terms of Service
          </p>
          <h1 className="text-heading-1 md:text-display font-bold tracking-display text-brand-800 leading-tight">
            이용약관 및 환불정책
          </h1>
          <div className="mt-4 h-px bg-gradient-to-r from-brand-300/60 to-transparent" />
        </header>

        <TermsBody />
      </div>
    </main>
  );
}
