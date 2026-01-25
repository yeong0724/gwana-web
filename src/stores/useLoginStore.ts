import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';

import { LoginStore, LoginStoreState } from '@/types';
import { SocialProviderEnum } from '@/types/enum';

export const initailLoginStoreState: LoginStoreState = {
  isLoggedIn: false,
  provider: SocialProviderEnum.NONE,
};

export const loginStore = create<LoginStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      provider: SocialProviderEnum.NONE,
      loginStoreHydrated: false,
      clearLogout: () => set({ ...initailLoginStoreState }),
      setLogin: (loginInfo: Partial<LoginStoreState>) => set((state) => ({ ...state, ...loginInfo })),
      setLoginStoreHydrated: (loginStoreHydrated: boolean) => set({ loginStoreHydrated }),
    }),
    {
      name: 'login-store',
      onRehydrateStorage: () => (state) => {
        state?.setLoginStoreHydrated(true);
      },
    }
  )
);

const useLoginStore = () =>
  loginStore(
    useShallow((state) => ({
      isLoggedIn: state.isLoggedIn,
      provider: state.provider,
      loginStoreHydrated: state.loginStoreHydrated,
      clearLogout: state.clearLogout,
      setLogin: state.setLogin,
    }))
  );

export const loginActions = {
  clearLogout: () => loginStore.getState().clearLogout(),
  getLogin: () => loginStore.getState().isLoggedIn,
  getProvider: () => loginStore.getState().provider,
  setLogin: (loginInfo: Partial<LoginStoreState>) => loginStore.getState().setLogin(loginInfo),
};

export default useLoginStore;