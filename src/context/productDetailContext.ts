import { CarouselApi } from '@/components/ui/carousel';
import createGenericContext from '@/providers/ContextProvider';
import {
  DropdownOption,
  ProductDetailResponse,
  PurchaseList,
  Review,
  ReviewListSearchRequest,
  RoleEnum,
} from '@/types';

type ProductDetailStateContextType = {
  product: ProductDetailResponse;
  optionList: DropdownOption[];
  api: CarouselApi;
  current: number;
  isMounted: boolean;
  isBottomPanelOpen: boolean;
  purchaseList: PurchaseList[];
  totalPrice: number;
  reviewList: Review[];
  totalReviewCount: number;
  reviewSearchPayload: Omit<ReviewListSearchRequest, 'page'>;
  role: RoleEnum;
};

type ProductDetailControllerContextType = {
  setApi: (api: CarouselApi) => void;
  setCurrent: (current: number) => void;
  handleShare: () => void;
  setIsBottomPanelOpen: (isBottomPanelOpen: boolean) => void;
  onOptionSelect: (value: string) => void;
  setPurchaseList: (purchaseList: PurchaseList[]) => void;
  handleQuantityChange: (index: number, quantity: number) => void;
  onCartMobileHandler: () => void;
  onPurchaseMobileHandler: () => void;
  handleAddToCart: () => void;
  handlePurchase: () => void;
  setReviewSearchPayload: (reviewSearchPayload: Omit<ReviewListSearchRequest, 'page'>) => void;
  handleReviewOpen: () => void;
};

export const { Provider, useStateContext, useControllerContext } = createGenericContext<
  ProductDetailStateContextType,
  ProductDetailControllerContextType
>();
