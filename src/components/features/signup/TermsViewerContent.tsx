'use client';

import {
  IdentityBody,
  PrivacyBody,
  TermsBody,
} from '@/components/features/terms/terms-content';

type TermsType = 'terms' | 'privacy' | 'identity';

type Props = {
  type: TermsType;
};

export const TERMS_TITLE: Record<TermsType, string> = {
  terms: '이용약관 및 환불정책',
  privacy: '개인정보처리방침',
  identity: '본인확인 서비스 이용약관',
};

const TermsViewerContent = ({ type }: Props) => {
  switch (type) {
    case 'terms':
      return <TermsBody />;
    case 'privacy':
      return <PrivacyBody />;
    case 'identity':
      return <IdentityBody />;
  }
};

export default TermsViewerContent;
