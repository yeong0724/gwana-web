'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { forEach, isEmpty, reduce } from 'lodash-es';

import { getRedirectUrl, renewLoginInfo, setRedirectUrl } from '@/lib/utils';
import { useCartService, useLoginService } from '@/service';
import { useAlertStore, useCartStore, useLoginStore } from '@/stores';
import { ResultCode, UpdateCartRequest } from '@/types';

interface Props {
  code: string;
}

const KakaoRedirectContainer = ({ code }: Props) => {
  const router = useRouter();
  const { showConfirmAlert } = useAlertStore();
  const { cart, _hasHydrated } = useCartStore();
  const { clearLogout } = useLoginStore();

  const { useGetAccessTokenByKakaoCode } = useLoginService();
  const { useUpdateCartListMutation } = useCartService();

  const { mutate: getAccessTokenByKakaoCode, isPending } = useGetAccessTokenByKakaoCode();
  const { mutateAsync: updateCartListAsync } = useUpdateCartListMutation();

  const callbackKakaoLogin = () => {
    getAccessTokenByKakaoCode(
      { code },
      {
        onSuccess: async ({ code, data }) => {
          if (code === ResultCode.SUCCESS) {
            renewLoginInfo(data);

            if (!isEmpty(cart)) {
              const updateCartList = reduce(
                cart,
                (acc, cur) => {
                  const { productId, quantity, optionRequired, options } = cur;
                  if (!optionRequired) {
                    acc.push({
                      productId,
                      quantity,
                      optionId: null,
                    });
                  }

                  forEach(options, (option) => {
                    acc.push({
                      productId,
                      optionId: option.optionId,
                      quantity: option.quantity,
                    });
                  });

                  return acc;
                },
                [] as UpdateCartRequest[]
              );

              await updateCartListAsync(updateCartList);
            }

            const redirectUrl = getRedirectUrl();
            router.replace(redirectUrl);
            setRedirectUrl('/');
          }
        },
        onError: async () => {
          const confirm = await showConfirmAlert({
            title: '에러',
            description: '카카오 로그인을 실패하였습니다.',
            size: 'sm',
          });

          if (confirm) {
            clearLogout();
            router.push('/login');
          }
        },
      }
    );
  };

  useEffect(() => {
    if (_hasHydrated) {
      callbackKakaoLogin();
    }
  }, [_hasHydrated]);

  return isPending && <p className="mt-[150px] text-lg">Kakao Login Processing...</p>;
};

export default KakaoRedirectContainer;
