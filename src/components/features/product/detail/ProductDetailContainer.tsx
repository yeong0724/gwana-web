'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';
import {
  clone,
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
  ProductVariant,
  Purchase,
  ResultCode,
  SortByEnum,
} from '@/types';

type Props = {
  productId: string;
};

const variantToPurchase = (v: ProductVariant): Purchase => ({
  productVariantId: v.productVariantId,
  productId: v.productId,
  optionLabel: v.optionLabel,
  price: v.price,
  status: v.status,
  quantity: 1,
});

const ProductDetailContainer = ({ productId }: Props) => {
  const productIdNum = Number(productId);
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
    productId: 0,
    name: '',
    categoryId: 0,
    categoryName: '',
    summary: null,
    detailContent: null,
    status: '',
    shippingPrice: 0,
    displayPrice: 0,
    galleryImages: [],
    detailImages: [],
    variants: [],
    addons: [],
    avgRating: 0,
    reviewCount: 0,
  });

  // 상품 선택 옵션
  const [purchaseList, setPurchaseList] = useState<Purchase[]>([]);

  const { useProductDetailQuery, useGetProductInquiryListInfiniteQuery } = useProductService();
  const { useGetReviewListInfiniteQuery } = useMypageService();

  /**
   * 상품 상세 정보 조회
   */
  const { data: productDetailData, error: productDetailError } = useProductDetailQuery(
    { productId: productIdNum },
    { enabled: true, gcTime: 60 * 60 * 1000, staleTime: 60 * 60 * 1000 }
  );

  const { data: productInquiryListData } = useGetProductInquiryListInfiniteQuery(
    { productId: productIdNum, isAnswered: '', excludeSecret: 'N', size: 5 },
    {
      enabled: pathname === `/product/${productId}`,
      gcTime: 60 * 60 * 100,
      staleTime: 60 * 1000,
    }
  );

  const { productInquiryList, totalInquiryCount } = useMemo(() => {
    if (productInquiryListData) {
      const { pages } = productInquiryListData;
      return {
        productInquiryList: pages.flatMap(({ data }) => data.data),
        totalInquiryCount: pages[0].data.totalCount,
      };
    }

    return {
      productInquiryList: [],
      totalInquiryCount: 0,
    };
  }, [productInquiryListData]);

  /**
   * 상품 리뷰 목록 조회 (무한 스크롤)
   */
  const { data: reviewListData } = useGetReviewListInfiniteQuery(
    {
      productId: productIdNum,
      sortBy: SortByEnum.LATEST,
      photoOnly: false,
      size: 5,
    },
    'productDetail',
    {
      enabled: pathname === `/product/${productId}`,
      gcTime: 60 * 60 * 100,
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
      // 임시저장/숨김/미존재 → 백엔드가 "존재하지 않는 상품" 코드로 응답
      if (productDetailData.code !== ResultCode.SUCCESS) {
        showAlert({
          title: '안내',
          description: '존재하지 않는 상품입니다.',
          onConfirm: () => router.back(),
        });
        return;
      }

      const { data } = productDetailData;

      const { variants } = data;

      // variant 가 하나뿐이면 자동 선택
      if (size(variants) === 1) {
        const only = head(variants) as ProductVariant;
        setPurchaseList((prev) => [...prev, variantToPurchase(only)]);
      }

      setProduct(data);
    } else if (productDetailError) {
      toast.error('상품 상세 정보를 불러오는데 실패하였습니다.');
    }
  }, [productDetailData, productDetailError]);

  // 구매 가능 여부: 판매중(ON_SALE)만 구매/장바구니 허용. 품절/단종은 노출은 하되 비활성.
  const isPurchasable = product.status === 'ON_SALE';

  const totalPrice = useMemo(() => {
    const totalProductPrice = sumBy(purchaseList, ({ price, quantity }) => price * quantity);
    // 배송비: 상품 단위 shipping_price(0=무료). 선택 항목이 없으면 0.
    const totalShippingPrice = isEmpty(purchaseList) ? 0 : product.shippingPrice;

    return totalProductPrice + totalShippingPrice;
  }, [purchaseList, product.shippingPrice]);

  const moveToLoginPage = () => {
    router.push('/login');
  };

  const handlePurchase = () => {
    if (!isPurchasable) {
      showAlert({ title: '안내', description: '현재 구매할 수 없는 상품입니다.', size: 'sm' });
      return;
    }
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
        title: product.name,
        description: `출처: 관아수제차 > 티 제품 > ${product.categoryName}`,
        imageUrl: `${process.env.NEXT_PUBLIC_APP_BASE_URL}${product.galleryImages[0] ?? ''}`,
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
    if (!isPurchasable) {
      showAlert({ title: '안내', description: '현재 구매할 수 없는 상품입니다.', size: 'sm' });
      return;
    }
    if (isEmpty(purchaseList)) {
      showAlert({ title: '안내', description: '옵션을 선택해주세요.', size: 'sm' });
      return;
    }

    // 로그인 상태인 경우
    if (isLoggedIn) {
      const payload = {
        productId: productIdNum,
        cartItems: map(purchaseList, ({ productVariantId, quantity }) => ({
          productVariantId,
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
      const index = findIndex(cart, { productId: productIdNum });

      if (index < 0) {
        const insertCart: Cart = {
          ...pick(product, ['name', 'categoryId', 'categoryName', 'shippingPrice']),
          thumbnailUrl: product.galleryImages[0] ?? null,
          cartId: 0,
          productId: productIdNum,
          cartItems: orderBy(
            map(purchaseList, (item) => ({ ...item, cartItemId: 0 })),
            ['sortOrder'],
            ['asc']
          ),
        };

        addCart(insertCart);
      } else {
        const updatedCart = clone(cart);
        forEach(purchaseList, (item) => {
          const { productVariantId, quantity } = item;
          const cartItemIndex = findIndex(updatedCart[index].cartItems, { productVariantId });
          if (cartItemIndex < 0) {
            updatedCart[index].cartItems.push({ ...item, cartItemId: 0 });
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
    const variant = find(product.variants, {
      productVariantId: Number(value),
    }) as ProductVariant | undefined;
    if (!variant) return;

    const index = findIndex(purchaseList, { productVariantId: variant.productVariantId });
    if (index < 0) {
      setPurchaseList((prev) => [...prev, variantToPurchase(variant)]);
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

  const { optionalOptions, requiredOptions } = useMemo(() => {
    return {
      // variant 를 셀렉트 목록으로 나열 (단일 축)
      requiredOptions: map(product.variants, ({ productVariantId, optionLabel, price }) => ({
        value: String(productVariantId),
        label: `${optionLabel} (${localeFormat(price)}원)`,
      })),
      optionalOptions: [],
    };
  }, [product.variants]);

  return (
    <>
      <Provider
        state={{
          product,
          isPurchasable,
          optionalOptions,
          requiredOptions,
          isMounted,
          isBottomPanelOpen,
          purchaseList,
          totalPrice,
          reviewList,
          totalReviewCount,
          averageRating,
          role,
          productInquiryList,
          totalInquiryCount,
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
