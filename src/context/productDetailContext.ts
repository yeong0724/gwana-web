import createGenericContext from '@/providers/ContextProvider';
import {
  DropdownOption,
  ProductDetailResponse,
  Purchase,
  Review,
  ReviewListSearchRequest,
  RoleEnum,
} from '@/types';

type ProductDetailStateContextType = {
  product: ProductDetailResponse;
  optionalOptions: DropdownOption[];
  requiredOptions: DropdownOption[];
  isMounted: boolean;
  isBottomPanelOpen: boolean;
  purchaseList: Purchase[];
  totalPrice: number;
  reviewList: Review[];
  totalReviewCount: number;
  reviewSearchPayload: Omit<ReviewListSearchRequest, 'page'>;
  role: RoleEnum;
};

type ProductDetailControllerContextType = {
  handleShare: () => void;
  setIsBottomPanelOpen: (isBottomPanelOpen: boolean) => void;
  onOptionSelect: (value: string) => void;
  setPurchaseList: (Purchase: Purchase[]) => void;
  handleQuantityChange: (index: number, quantity: number) => void;
  onCartMobileHandler: () => void;
  onPurchaseMobileHandler: () => void;
  handleAddToCart: () => void;
  handlePurchase: () => void;
  setReviewSearchPayload: (reviewSearchPayload: Omit<ReviewListSearchRequest, 'page'>) => void;
  handleReviewOpen: () => void;
  moveToInquiryWritePage: () => void;
};

export const { Provider, useStateContext, useControllerContext } = createGenericContext<
  ProductDetailStateContextType,
  ProductDetailControllerContextType
>();
