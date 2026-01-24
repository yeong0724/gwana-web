import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { LoginStore, LoginStoreState } from '@/types';
import { SocialProviderEnum } from '@/types/enum';

export const initailLoginStoreState: LoginStoreState = {
  isLoggedIn: false,
  provider: SocialProviderEnum.NONE,
};

export const loginStore = create<LoginStore>((set) => ({
  ...initailLoginStoreState,
  clearLogout: () => set({ ...initailLoginStoreState }),
  setLogin: (loginInfo: LoginStoreState) => set({ ...loginInfo }),
}));

const useLoginStore = () =>
  loginStore(
    useShallow((state) => ({
      isLoggedIn: state.isLoggedIn,
      provider: state.provider,
      clearLogout: state.clearLogout,
      setLogin: state.setLogin,
    }))
  );

export const loginActions = {
  clearLogout: () => loginStore.getState().clearLogout(),
  getLogin: () => loginStore.getState().isLoggedIn,
  getProvider: () => loginStore.getState().provider,
  setLogin: (loginInfo: LoginStoreState) => loginStore.getState().setLogin(loginInfo),
};

export default useLoginStore;
