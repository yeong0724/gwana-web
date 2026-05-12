import createGenericContext from '@/providers/ContextProvider';
import {
  DropdownOption,
  Inquiry,
  ProductDetailResponse,
  Purchase,
  Review,
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
  averageRating: number;
  role: RoleEnum;
  productInquiryList: Inquiry[];
  totalInquiryCount: number;
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
  handleReviewOpen: () => void;
  moveToInquiryWritePage: () => void;
};

export const { Provider, useStateContext, useControllerContext } = createGenericContext<
  ProductDetailStateContextType,
  ProductDetailControllerContextType
>();
