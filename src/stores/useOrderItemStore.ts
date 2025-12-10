import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';

import { Cart } from '@/types';

type StoreType = {
  orderItems: Cart[];
  setOrderItems: (orderItems: Cart[]) => void;
  clearOrderItems: () => void;
};

const initialState: Cart[] = [];

export const orderItemStore = create<StoreType>((set) => ({
  orderItems: initialState,
  setOrderItems: (orderItems) => set({ orderItems }),
  clearOrderItems: () => set({ orderItems: [] }),
}));

const useOrderItemStore = () =>
  orderItemStore(
    useShallow((state) => ({
      orderItems: state.orderItems,
      setOrderItems: state.setOrderItems,
      clearOrderItems: state.clearOrderItems,
    }))
  );

export default useOrderItemStore;
