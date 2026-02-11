import createGenericContext from '@/providers/ContextProvider';
import { DragScrollType, Menu, Product } from '@/types';

type ProductStateContextType = {
  categoryTabScroll: DragScrollType;
  productCategory: Menu[];
  categoryId: string;
  currentCategory: string;
  isTransitioning: boolean;
  productList: Product[];
};

type ProductControllerContextType = {
  onClickCategory: (menuId: string) => void;
  onClickProduct: (productId: string) => void;
};

export const { Provider, useStateContext, useControllerContext } = createGenericContext<
  ProductStateContextType,
  ProductControllerContextType
>();
