import { SocialProviderEnum, User } from '@/types';

export type UserStore = {
  user: User;
  setUser: (user: Partial<User>) => void;
  clearUser: () => void;
};

export type LoginStoreState = Omit<LoginStore, 'clearLogout' | 'setLogin'>;

export type LoginStore = {
  isLoggedIn: boolean;
  provider: SocialProviderEnum;
  setLogin: (loginInfo: LoginStoreState) => void;
  clearLogout: () => void;
};
