import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';

type StoreType = {
  bottomOffset: number;
  hidden: boolean;
  setBottomOffset: (px: number) => void;
  setHidden: (v: boolean) => void;
};

const scrollTopStore = create<StoreType>((set) => ({
  bottomOffset: 0,
  hidden: false,
  setBottomOffset: (px) => set({ bottomOffset: px }),
  setHidden: (v) => set({ hidden: v }),
}));

const useScrollTopStore = () =>
  scrollTopStore(
    useShallow((state) => ({
      bottomOffset: state.bottomOffset,
      hidden: state.hidden,
      setBottomOffset: state.setBottomOffset,
      setHidden: state.setHidden,
    }))
  );

export default useScrollTopStore;
