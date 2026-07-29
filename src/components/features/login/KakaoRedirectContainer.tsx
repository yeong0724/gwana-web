'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { isEmpty, map, reduce } from 'lodash-es';
import { toast } from 'sonner';

import { asyncFn, getRedirectUrl, renewLoginInfo, setRedirectUrl } from '@/lib/utils';
import { useCartService, useLoginService } from '@/service';
import { useAlertStore, useCartStore, useLoginStore } from '@/stores';
import { ResultCode, UpsertCartRequest } from '@/types';

interface Props {
  code: string;
}

const KakaoRedirectContainer = ({ code: kakaoCode }: Props) => {
  const router = useRouter();
  const { showConfirmAlert } = useAlertStore();
  const { cart, _hasHydrated } = useCartStore();
  const { clearLogout } = useLoginStore();

  const { useGetAccessTokenByKakaoCode } = useLoginService();
  const { useUpsertCartListMutation } = useCartService();

  const { mutateAsync: getAccessTokenByKakaoCodeAsync, isPending } = useGetAccessTokenByKakaoCode();
  const { mutateAsync: upsertCartListAsync } = useUpsertCartListMutation();

  const callbackKakaoLogin = async () => {
    const [getAccessTokenByKakaoCodeError, getAccessTokenByKakaoCodeResponse] = await asyncFn(
      getAccessTokenByKakaoCodeAsync({ code: kakaoCode })
    );

    if (!getAccessTokenByKakaoCodeError) {
      const { code, data } = getAccessTokenByKakaoCodeResponse;
      if (code === ResultCode.SUCCESS) {
        renewLoginInfo(data);

        if (!isEmpty(cart)) {
          const upsertCartList = reduce(
            cart,
            (acc, { productId, cartItems }) => {
              return acc.concat({
                productId,
                cartItems: map(cartItems, ({ productVariantId, quantity }) => ({
                  productVariantId,
                  quantity,
                })),
              });
            },
            [] as UpsertCartRequest[]
          );

          const [error] = await asyncFn(upsertCartListAsync(upsertCartList));
          if (error) {
            toast.error('장바구니 동기화에 실패하였습니다.');
          }
        }

        const redirectUrl = getRedirectUrl();
        router.replace(redirectUrl);
        setRedirectUrl('/');
      }
    } else {
      // 서버가 내려준 안내 메시지를 우선 노출한다.
      // (예: 이미 가입된 이메일 → 기존 계정으로 로그인 유도, 카카오 이메일 미동의 등)
      const description =
        getAccessTokenByKakaoCodeError.message || '카카오 로그인을 실패하였습니다.';

      const confirm = await showConfirmAlert({
        title: '알림',
        description,
        size: 'sm',
      });

      if (confirm) {
        clearLogout();
        router.push('/login');
      }
    }
  };

  useEffect(() => {
    if (_hasHydrated) {
      callbackKakaoLogin();
    }
  }, [_hasHydrated]);

  return isPending && <p className="mt-[150px] text-lg">Kakao Login Processing...</p>;
};

export default KakaoRedirectContainer;
