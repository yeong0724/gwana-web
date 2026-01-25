import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAlertStore, useLoginStore } from '@/stores';
import { loginActions } from '@/stores/useLoginStore';

const useRequireAuth = () => {
  const router = useRouter();
  const { showConfirmAlert } = useAlertStore();
  const { loginStoreHydrated } = useLoginStore();

  const isLoggedIn = loginActions.getLogin();

  useEffect(() => {
    if (!loginStoreHydrated) return;

    console.log('isLoggedInisLoggedIn', isLoggedIn);
    if (!isLoggedIn) {
      (async () => {
        await showConfirmAlert({
          title: '안내',
          description: '로그인이 필요합니다.',
          confirmText: '확인',
        });
        router.push('/login');
      })();
    }
  }, [loginStoreHydrated, isLoggedIn]);
};

export default useRequireAuth;
