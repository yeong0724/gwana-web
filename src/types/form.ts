import { z } from 'zod';

// import { pwdSpecialCharValidate } from '@/lib/utils';

export const userAccountSchema = z.object({
  email: z.email({
    pattern: z.regexes.html5Email,
    error: '올바르지 않은 이메일 형식입니다',
  }),
  password: z.string(),
  // password: z
  //   .string()
  //   .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
  //   .regex(/[A-Za-z]/, '비밀번호에는 문자가 포함되어야 합니다')
  //   .regex(/[0-9]/, '비밀번호에는 숫자가 포함되어야 합니다')
  //   .regex(/[!@#$%^&*()_+\-=\[\]{}|;':",./<>?~`]/, '비밀번호에는 특수문자가 포함되어야 합니다')
  //   .refine((password) => pwdSpecialCharValidate(password), {
  //     error: '비밀번호에는 특수문자가 최소 2개 이상 포함되어야 합니다',
  //   }),
});

export type UserAccountInfo = z.infer<typeof userAccountSchema>;

// UserAccountInfo 타입에서 자동으로 enum을 생성하는 유틸리티 타입
export type FormFieldsEnum<T> = {
  [K in keyof T as Uppercase<string & K>]: K;
};

export type PaymentForm = {
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  zonecode: string;
  roadAddress: string;
  detailAddress: string;
  deliveryRequest: string;
  deliveryRequestDetail: string;
};

export interface MyinfoForm {
  profileImage: string | null;
  email: string;
  username: string;
  phoneFirst: string;
  phoneMiddle: string;
  phoneLast: string;
  zonecode: string;
  roadAddress: string;
  detailAddress: string;
}

export interface SignupForm {
  email: string;
  password: string;
  passwordConfirm: string;
  username: string;
  phone: string;
  zonecode: string;
  roadAddress: string;
  detailAddress: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeAge14: boolean;
  agreeMarketing: boolean;
}

