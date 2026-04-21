import type { Dispatch, RefObject, SetStateAction } from 'react';

import type { MotionValue } from 'framer-motion';

import createGenericContext from '@/providers/ContextProvider';
import { HeroSlide, Product } from '@/types';

type MainStateContextType = {
  heroIndex: number;
  heroAutoplay: boolean;
  isSoundOn: boolean;
  isHeroDragging: boolean;
  slideDuration: number;
  currentSlide: HeroSlide;
  scrollRef: RefObject<HTMLDivElement | null>;
  videoRefs: RefObject<(HTMLVideoElement | null)[]>;
  heroParallaxY: MotionValue<string>;
  productList: Product[];
  popularProducts: Product[];
};

type MainControllerContextType = {
  setHeroIndex: Dispatch<SetStateAction<number>>;
  setHeroAutoplay: Dispatch<SetStateAction<boolean>>;
  setIsSoundOn: Dispatch<SetStateAction<boolean>>;
  setIsHeroDragging: Dispatch<SetStateAction<boolean>>;
  onClickProduct: (productId: string) => void;
  onMoveToProductPage: () => void;
  onClickCategory: (categoryId: string) => void;
  onClickViewAll: () => void;
};

export const { Provider, useStateContext, useControllerContext } = createGenericContext<
  MainStateContextType,
  MainControllerContextType
>();
