import { Metadata } from 'next';

import SignupContainer from '@/components/features/signup/SignupContainer';

export const metadata: Metadata = {
  title: '회원가입 | 관아수제차',
  description: '관아수제차 회원가입',
};

export default function SignupPage() {
  return <SignupContainer />;
}
