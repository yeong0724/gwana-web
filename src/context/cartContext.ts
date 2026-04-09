import createGenericContext from '@/providers/ContextProvider';
import { Cart, CartState } from '@/types';

type CartStateContextType = {
  cart: CartState[];
  isNoSelect: boolean;
  totalProductPrice: number;
  totalShippingPrice: number;
};

type CartControllerContextType = {
  moveToOrderPage: () => void;
  onAllCheckboxHandler: (checked: boolean) => void;
  onDeleteCartList: () => void;
  onCheckboxHandler: (checked: boolean, index: number) => void;
  onUpdateCartQuantity: (
    cartItemId: string,
    index: number,
    cartItemIndex: number,
    quantity: number,
    quantityDelta: number
  ) => void;
  onDeleteCart: (cartItemId: string, index: number, cartItemIndex: number) => void;
  getSumProductPrice: (item: Cart) => number;
  getShippingPrice: (item: Cart) => number;
};

export const { Provider, useStateContext, useControllerContext } = createGenericContext<
  CartStateContextType,
  CartControllerContextType
>();
