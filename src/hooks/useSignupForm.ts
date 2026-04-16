import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { SignupForm } from '@/types';

const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: '이메일을 입력해주세요' })
      .email({ message: '올바른 이메일 형식이 아닙니다' }),
    password: z
      .string()
      .min(8, { message: '비밀번호는 최소 8자 이상이어야 합니다' })
      .regex(/[A-Za-z]/, { message: '비밀번호에 영문자를 포함해주세요' })
      .regex(/[0-9]/, { message: '비밀번호에 숫자를 포함해주세요' })
      .regex(/[!@#$%^&*()_+\-=\[\]{}|;':",./<>?~`]/, {
        message: '비밀번호에 특수문자를 포함해주세요',
      }),
    passwordConfirm: z.string().min(1, { message: '비밀번호 확인을 입력해주세요' }),
    zonecode: z.string().min(1, { message: '우편번호를 검색해주세요' }),
    roadAddress: z.string().min(1, { message: '주소를 검색해주세요' }),
    detailAddress: z.string().min(1, { message: '상세주소를 입력해주세요' }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });

const useSignupForm = () => {
  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      zonecode: '',
      roadAddress: '',
      detailAddress: '',
    },
    mode: 'onSubmit',
  });

  const {
    setValue,
    handleSubmit,
    clearErrors,
    watch,
    formState: { errors },
  } = form;

  return { form, setValue, handleSubmit, clearErrors, errors, watch };
};

export default useSignupForm;
