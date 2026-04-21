'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import {
  clone,
  filter,
  find,
  findIndex,
  forEach,
  head,
  isEmpty,
  map,
  orderBy,
  pick,
  size,
  sumBy,
} from 'lodash-es';
import { toast } from 'sonner';

import { ResponsiveFrame } from '@/components/common/frame';
import { ProductReviewSheet, PurchaseGuideModal, ShareModal } from '@/components/common/modal';
import ProductDetailMobileView from '@/components/features/product/detail/ProductDetailMobileView';
import ProductDetailWebView from '@/components/features/product/detail/ProductDetailWebView';
import { Provider } from '@/context/productDetailContext';
import { localeFormat } from '@/lib/utils';
import { useCartService, useMypageService, useProductService } from '@/service';
import { useAlertStore, useCartStore, useLoginStore, useUserStore } from '@/stores';
import { cartActions } from '@/stores/useCartStore';
import {
  Cart,
  ProductDetailResponse,
  ProductOption,
  Purchase,
  ReviewListSearchRequest,
  SortByEnum,
} from '@/types';

type Props = {
  productId: string;
};

const ProductDetailContainer = ({ productId }: Props) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useLoginStore();
  const {
    user: { role },
  } = useUserStore();
  const { showAlert } = useAlertStore();
  const { setCart, addCart } = useCartStore();

  const { useUpsertCartMutation } = useCartService();
  const { mutate: upsertCartMutate } = useUpsertCartMutation();

  const [purchaseGuideModalOpen, setPurchaseGuideModalOpen] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);

  // 모바일 하단 패널 토글 상태
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);

  // 제품 리뷰 모달 상태
  const [reviewOpen, setReviewOpen] = useState<boolean>(false);

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
    options: [],
  });

  // 상품 선택 옵션
  const [purchaseList, setPurchaseList] = useState<Purchase[]>([]);

  // 리뷰 검색 옵션
  const [reviewSearchPayload, setReviewSearchPayload] = useState<
    Omit<ReviewListSearchRequest, 'page'>
  >({
    productId,
    sortBy: SortByEnum.LATEST,
    photoOnly: false,
    size: 5,
  });

  const { useProductDetailQuery } = useProductService();
  const { useGetReviewListInfiniteQuery } = useMypageService();

  /**
   * 상품 상세 정보 조회
   */
  const { data: productDetailData, error: productDetailError } = useProductDetailQuery(
    { productId },
    { enabled: true, gcTime: 60 * 60 * 1000, staleTime: 60 * 60 * 1000 }
  );

  /**
   * 상품 리뷰 목록 조회 (무한 스크롤)
   */
  const { data: reviewListData } = useGetReviewListInfiniteQuery(
    reviewSearchPayload,
    'productDetail',
    {
      enabled: pathname === `/product/${productId}`,
      staleTime: 60 * 1000,
    }
  );

  const { reviewList, totalReviewCount, averageRating } = useMemo(() => {
    if (reviewListData) {
      const { pages } = reviewListData;
      return {
        reviewList: pages.flatMap(({ data }) => data.data),
        totalReviewCount: pages[0].data.totalCount,
        averageRating: pages[0].data.averageRating ?? 0,
      };
    }

    return {
      reviewList: [],
      totalReviewCount: 0,
      averageRating: 0,
    };
  }, [reviewListData]);

  // 클라이언트 마운트 감지 + 스크롤 최상단 이동
  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);

    router.prefetch(`/mypage/inquiry/write?productId=${productId}`);
  }, []);

  useEffect(() => {
    if (productDetailData) {
      const { data } = productDetailData;

      const { options } = data;

      const requiredOptions = filter(options, { isRequired: true });
      if (size(requiredOptions) === 1) {
        const requiredOption = { ...head(requiredOptions), quantity: 1 } as Purchase;
        setPurchaseList((prev) => [...prev, requiredOption]);
      }

      setProduct(data);
    } else if (productDetailError) {
      toast.error('상품 상세 정보를 불러오는데 실패하였습니다.');
    }
  }, [productDetailData, productDetailError]);

  const totalPrice = useMemo(() => {
    const totalProductPrice = sumBy(
      purchaseList,
      ({ optionPrice, quantity }) => optionPrice * quantity
    );
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
    if (isEmpty(filter(purchaseList, { isRequired: true }))) {
      showAlert({ title: '안내', description: '필수 옵션을 선택해주세요.', size: 'sm' });
      return;
    }

    setPurchaseGuideModalOpen(true);
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleKakaoShare = () => {
    const { Kakao, location } = window;

    if (!Kakao || !Kakao.Share) {
      showAlert({
        title: '안내',
        description: '카카오 SDK 로드 중입니다. 잠시 후 다시 시도해주세요.',
        size: 'sm',
      });
      return;
    }

    if (!Kakao.isInitialized()) {
      const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
      if (!key) {
        showAlert({
          title: '에러',
          description: '카카오 공유 설정이 누락되었습니다.',
          size: 'sm',
        });
        return;
      }
      Kakao.init(key);
    }

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
    if (isEmpty(filter(purchaseList, { isRequired: true }))) {
      showAlert({ title: '안내', description: '필수 옵션을 선택해주세요.', size: 'sm' });
      return;
    }

    // 로그인 상태인 경우
    if (isLoggedIn) {
      const payload = {
        productId,
        cartItems: map(purchaseList, ({ productOptionId, quantity }) => ({
          productOptionId,
          quantity,
        })),
      };

      upsertCartMutate(payload, {
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
      const cart = cartActions.cart();
      const index = findIndex(cart, { productId });

      if (index < 0) {
        const insertCart: Cart = {
          ...pick(product, [
            'productName',
            'categoryId',
            'categoryName',
            'images',
            'price',
            'shippingPrice',
          ]),
          cartId: '',
          productId,
          cartItems: orderBy(
            map(purchaseList, (item) => ({ ...item, cartItemId: '' })),
            ['isRequired'],
            ['desc']
          ),
        };

        addCart(insertCart);
      } else {
        const updatedCart = clone(cart);
        forEach(purchaseList, (item) => {
          const { productOptionId, quantity } = item;
          const cartItemIndex = findIndex(updatedCart[index].cartItems, { productOptionId });
          if (cartItemIndex < 0) {
            updatedCart[index].cartItems.push({ ...item, cartItemId: '' });
          } else {
            updatedCart[index].cartItems[cartItemIndex].quantity += quantity;
          }
        });

        setCart(updatedCart);
      }

      setPurchaseList([]);
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
    setPurchaseList((prev) => {
      prev[index].quantity = quantity;
      return [...prev];
    });
  };

  const onOptionSelect = (value: string) => {
    const option = find(product.options, { productOptionId: value }) as ProductOption;

    const { productOptionId } = option;
    const index = findIndex(purchaseList, { productOptionId });
    if (index < 0) {
      setPurchaseList((prev) => [...prev, { ...option, quantity: 1 }]);
    } else {
      showAlert({ title: '안내', description: '이미 선택한 옵션입니다.' });
    }
  };

  const handleReviewOpen = () => {
    setReviewOpen(true);
  };

  const moveToInquiryWritePage = () => {
    router.push(`/mypage/inquiry/write?productId=${productId}`);
  };

  const getOptionList = (isRequired: boolean) => {
    const options = filter(product.options, { isRequired });
    return map(options, ({ productOptionId, optionName, optionPrice }) => ({
      value: productOptionId,
      label: `${optionName} (+${localeFormat(optionPrice)}원)`,
    }));
  };

  const { optionalOptions, requiredOptions } = useMemo(() => {
    return {
      optionalOptions: getOptionList(false),
      requiredOptions: getOptionList(true),
    };
  }, [product.options]);

  return (
    <>
      <Provider
        state={{
          product,
          optionalOptions,
          requiredOptions,
          isMounted,
          isBottomPanelOpen,
          purchaseList,
          totalPrice,
          reviewList,
          totalReviewCount,
          averageRating,
          reviewSearchPayload,
          role,
        }}
        controller={{
          handleShare,
          setIsBottomPanelOpen,
          onOptionSelect,
          setPurchaseList,
          handleQuantityChange,
          onCartMobileHandler,
          onPurchaseMobileHandler,
          handleAddToCart,
          handlePurchase,
          setReviewSearchPayload,
          handleReviewOpen,
          moveToInquiryWritePage,
        }}
      >
        <ResponsiveFrame
          mobileComponent={<ProductDetailMobileView />}
          webComponent={<ProductDetailWebView />}
        />
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
      <ProductReviewSheet
        reviewOpen={reviewOpen}
        setReviewOpen={setReviewOpen}
        productId={productId}
      />
    </>
  );
};

export default ProductDetailContainer;
