import createGenericContext from '@/providers/ContextProvider';
import { Menu, MenuGroup } from '@/types';

type HeaderStateContextType = {
  isHeaderHovered: boolean;
  isMainHovered: boolean;
  menuGroup: MenuGroup;
  modileHeaderStyle: string;
  pathname: string;
  isScrolled: boolean;
  cartCount: number;
  isMenuOpen: boolean;
  main: Menu[];
  category: Menu[];
  isLoggedIn: boolean;
};

type HeaderControllerContextType = {
  setIsHeaderHovered: (isHeaderHovered: boolean) => void;
  setIsMainHovered: (isMainHovered: boolean) => void;
  goBackWithTransitions: () => void;
  goHome: () => void;
  goToCartPage: () => void;
  goToLoginPage: () => void;
  goToMyPage: () => void;
  goToOrderHistoryPage: () => void;
  toggleMenu: () => void;
  onClickMain: (menuId: string) => void;
  onClickCategory: (mainMenuId: string, categoryMenuId: string) => void;
  handleLogout: () => void;
};

export const { Provider, useStateContext, useControllerContext } = createGenericContext<
  HeaderStateContextType,
  HeaderControllerContextType
>();
