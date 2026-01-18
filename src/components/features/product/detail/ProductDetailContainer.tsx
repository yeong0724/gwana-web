'use client';

import ProductDetailWebView from './ProductDetailWebView';
import { PurchaseGuideModal, ShareModal } from '@/components/common/modal';
import ProductDetailMobileView from '@/components/features/product/detail/ProductDetailMobileView';
import { type CarouselApi } from '@/components/ui/carousel';
import { Provider } from '@/context/productDetailContext';
import { useCartService, useProductService } from '@/service';
import { useAlertStore, useCartStore, useLoginStore } from '@/stores';
import { cartActions } from '@/stores/useCartStore';
import { Cart, CartOption, ProductDetailResponse, ProductOption, PurchaseList } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { clone, findIndex, forEach, isEmpty, pick, sumBy } from 'lodash-es';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const purchasePick = [
  'productId',
  'productName',
  'categoryName',
  'optionRequired',
  'price',
  'shippingPrice',
  'images',
];

type Props = {
  productId: string;
};

const ProductDetailContainer = ({ productId }: Props) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();
  const { isLogin } = useLoginStore();
  const { showAlert } = useAlertStore();
  const { setCart, addCart } = useCartStore();

  const { useUpdateCartListMutation } = useCartService();
  const { mutate: updateCartListMutate } = useUpdateCartListMutation();

  const [purchaseGuideModalOpen, setPurchaseGuideModalOpen] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);

  // Carousel State
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // 모바일 하단 패널 토글 상태
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);

  // Portal을 위한 클라이언트 마운트 상태
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [product, setProduct] = useState<ProductDetailResponse>({
    productId: '',
    productName: '',
    categoryId: '',
    categoryName: '',
    images: [],
    infos: [],
    price: 0,
    shippingPrice: 0,
    optionRequired: false,
    options: [],
  });

  // 상품 선택 옵션
  const [purchaseList, setPurchaseList] = useState<PurchaseList[]>([]);

  const { useProductDetailQuery } = useProductService();
  const { data: productDetailData, error: productDetailError } = useProductDetailQuery(
    { productId },
    { enabled: true }
  );

  // 클라이언트 마운트 감지 + 스크롤 최상단 이동
  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  useEffect(() => {
    if (productDetailData) {
      const { data } = productDetailData;

      /**
       * optionRequired false인 경우 옵션 선택이 필수가 아니므로 상품 메인정보를 구매 리스트에 추가
       */
      if (!data.optionRequired) {
        setPurchaseList([
          {
            ...pick(data, purchasePick),
            quantity: 1,
            optionId: '',
            optionName: '',
            optionPrice: 0,
          } as PurchaseList,
        ]);
      }

      setProduct(data);
    } else if (productDetailError) {
      toast.error('상품 상세 정보를 불러오는데 실패하였습니다.');
    }
  }, [productDetailData, productDetailError]);

  const totalPrice = useMemo(() => {
    const totalProductPrice = sumBy(purchaseList, ({ price, quantity }) => price * quantity);
    const totalShippingPrice =
      totalProductPrice >= 50000 || isEmpty(purchaseList) ? 0 : product.shippingPrice;

    return totalProductPrice + totalShippingPrice;
  }, [purchaseList, product.shippingPrice]);

  const moveToLoginPage = () => {
    router.push('/login');
  };

  const handlePurchase = () => {
    // if (isLogin) {
    //   router.push('/payment');
    // } else {
    //   setPurchaseGuideModalOpen(true);
    // }
    if (isEmpty(purchaseList)) {
      showAlert({ title: '안내', description: '옵션을 선택해주세요.', size: 'sm' });
      return;
    }

    setPurchaseGuideModalOpen(true);
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleKakaoShare = () => {
    const { Kakao, location } = window;
    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: product.productName,
        description: `출처: 관아수제차 > 티 제품 > ${product.categoryName}`,
        imageUrl: `${process.env.NEXT_PUBLIC_APP_BASE_URL}${product.images[0]}`,
        link: {
          mobileWebUrl: location.href,
          webUrl: location.href,
        },
      },
      buttons: [
        {
          title: '관아수제차 방문하기',
          link: {
            mobileWebUrl: `${process.env.NEXT_PUBLIC_APP_BASE_URL}${pathname}`,
            webUrl: `${process.env.NEXT_PUBLIC_APP_BASE_URL}${pathname}`,
          },
        },
      ],
    });
  };

  /**
   * 장바구니 상품 추가
   */
  const handleAddToCart = () => {
    if (isEmpty(purchaseList)) {
      showAlert({ title: '안내', description: '옵션을 선택해주세요.', size: 'sm' });
      return;
    }

    // 로그인 상태인 경우
    if (isLogin) {
      updateCartListMutate(purchaseList, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cartList'], refetchType: 'all' });
          handleSuccessToast();
        },
        /* eslint-disable @typescript-eslint/no-unused-vars */
        onError: (error) => {
          toast.error('장바구니 추가 실패하였습니다.');
        },
      });
    }
    // 비로그인 상태인 경우
    else {
      forEach(purchaseList, (item) => {
        const {
          productId,
          productName,
          categoryName,
          price,
          shippingPrice,
          images,
          quantity,
          optionId,
          optionName,
          optionPrice,
          optionRequired,
        } = item;

        const cart = cartActions.cart();
        const index = findIndex(cart, { productId });

        const option: CartOption = {
          cartId: '',
          optionId: optionId!,
          optionName,
          quantity,
          optionPrice,
        };

        if (index < 0) {
          const cartItem: Cart = {
            cartId: '',
            productId,
            productName,
            categoryName,
            price,
            shippingPrice,
            images,
            quantity,
            optionRequired,
            options: optionId ? [option] : [],
          };

          addCart(cartItem);
        } else {
          const updatedCart = clone(cart);

          if (!optionId) updatedCart[index].quantity += quantity;
          else {
            const optionIndex = findIndex(updatedCart[index].options, { optionId });
            if (optionIndex < 0) {
              updatedCart[index].options.push(option);
            } else {
              updatedCart[index].options[optionIndex].quantity += quantity;
            }
          }

          setCart(updatedCart);
        }
      });

      handleSuccessToast();
    }

    setIsBottomPanelOpen(false);
  };

  const onPurchaseMobileHandler = () => {
    if (isBottomPanelOpen) {
      handlePurchase();
      return;
    }

    setIsBottomPanelOpen(true);
  };

  const onCartMobileHandler = () => {
    if (!isBottomPanelOpen) {
      setIsBottomPanelOpen(true);
      return;
    }

    handleAddToCart();
  };

  const handleSuccessToast = () => {
    toast.success('상품이 장바구니에 추가되었습니다', {
      description: '장바구니 페이지에서 확인하세요',
    });
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedCart = clone(purchaseList);
    updatedCart[index].quantity = quantity;
    setPurchaseList(updatedCart);
  };

  const onOptionSelect = (option: ProductOption) => {
    const { optionId, optionName, optionPrice } = option;
    const index = findIndex(purchaseList, { optionId });
    if (index < 0) {
      setPurchaseList((prev) => {
        return [
          ...prev,
          {
            ...pick(product, purchasePick),
            quantity: 1,
            optionId,
            optionName,
            optionPrice,
          } as PurchaseList,
        ];
      });
    } else {
      showAlert({ title: '안내', description: '이미 선택한 옵션입니다.' });
    }
  };

  return (
    <>
      <Provider
        state={{
          product,
          api,
          current,
          isMounted,
          isBottomPanelOpen,
          purchaseList,
          totalPrice,
        }}
        controller={{
          setApi,
          setCurrent,
          handleShare,
          setIsBottomPanelOpen,
          onOptionSelect,
          setPurchaseList,
          handleQuantityChange,
          onCartMobileHandler,
          onPurchaseMobileHandler,
          handleAddToCart,
          handlePurchase,
        }}
      >
        <>
          {/* Web View */}
          <ProductDetailWebView />

          {/* Mobile View */}
          <ProductDetailMobileView />
        </>
      </Provider>
      {/* Modal Area */}
      <PurchaseGuideModal
        modalOpen={purchaseGuideModalOpen}
        setModalOpen={setPurchaseGuideModalOpen}
        moveToLoginPage={moveToLoginPage}
      />
      <ShareModal
        modalOpen={shareModalOpen}
        setModalOpen={setShareModalOpen}
        onKakaoShare={handleKakaoShare}
      />
    </>
  );
};

export default ProductDetailContainer;
