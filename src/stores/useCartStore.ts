import { concat } from 'lodash-es';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';

import { Cart } from '@/types';

type StoreType = {
  cart: Cart[];
  _hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  addCart: (cart: Cart) => void;
  setCart: (count: Cart[]) => void;
  clearCart: () => void;
};

const initialState: Cart[] = [];

const cartStore = create<StoreType>()(
  persist(
    (set) => ({
      cart: initialState,
      _hasHydrated: false,
      addCart: (cart) => set((state) => ({ cart: concat(state.cart, cart) })),
      setCart: (cartList) => set({ cart: cartList }),
      clearCart: () => set({ cart: [] }),
      setHasHydrated: (hasHydrated: boolean) => set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: 'cart', // localStorage key
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export const cartActions = {
  clearCart: () => cartStore.getState().clearCart(),
  cart: () => cartStore.getState().cart,
};

const useAlertStore = () =>
  cartStore(
    useShallow((state) => ({
      cart: state.cart,
      _hasHydrated: state._hasHydrated,
      addCart: state.addCart,
      setCart: state.setCart,
      clearCart: state.clearCart,
    }))
  );

export default useAlertStore;
