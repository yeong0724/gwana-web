import { SocialProviderEnum, User } from '@/types';

export type UserStore = {
  user: User;
  setUser: (user: Partial<User>) => void;
  clearUser: () => void;
};

export type LoginStoreState = Omit<
  LoginStore,
  'clearLogout' | 'setLogin' | 'setLoginStoreHydrated' | 'loginStoreHydrated'
>;

export type LoginStore = {
  isLoggedIn: boolean;
  provider: SocialProviderEnum;
  loginStoreHydrated: boolean;
  setLogin: (loginInfo: Partial<LoginStoreState>) => void;
  clearLogout: () => void;
  setLoginStoreHydrated: (loginStoreHydrated: boolean) => void;
};
