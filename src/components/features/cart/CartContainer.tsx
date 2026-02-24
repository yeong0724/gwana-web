'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { cloneDeep, filter, findIndex, isEmpty, map, reject, some, sumBy } from 'lodash-es';
import { toast } from 'sonner';

import { ResponsiveFrame } from '@/components/common/frame';
import { PurchaseGuideModal } from '@/components/common/modal';
import CartModileView from '@/components/features/cart/CartModileView';
import CartWebView from '@/components/features/cart/CartWebView';
import { Provider } from '@/context/cartContext';
import useNativeRouter from '@/hooks/useNativeRouter';
import { setRedirectUrl } from '@/lib/utils';
import { useCartService, usePaymentService } from '@/service';
import { useAlertStore, useCartStore, useLoginStore } from '@/stores';
import { AddToCartRequest, Breakpoint, Cart, CartState } from '@/types';

const FREE_SHIPPING_THRESHOLD = 50000;

const CartContainer = () => {
  const router = useRouter();
  const { forward } = useNativeRouter();
  const { cart: cartStore, setCart: setCartStore, _hasHydrated } = useCartStore();
  const { isLoggedIn } = useLoginStore();
  const { showConfirmAlert } = useAlertStore();
  const [purchaseGuideModalOpen, setPurchaseGuideModalOpen] = useState<boolean>(false);

  const {
    useDeleteCartMutation,
    useDeleteCartListMutation,
    useGetCartListQuery,
    useAddToCartMutation,
  } = useCartService();

  const { useCreatePaymentSessionMutation } = usePaymentService();

  const { data: cartListData, error: cartListError } = useGetCartListQuery({
    enabled: isLoggedIn,
  });

  const { mutate: deleteCartMutate } = useDeleteCartMutation();
  const { mutate: deleteCartListMutate } = useDeleteCartListMutation();
  const { mutateAsync: addToCartAsync, isPending: isPendingAddToCart } = useAddToCartMutation();
  const { mutateAsync: createPaymentSessionAsync } = useCreatePaymentSessionMutation();

  const [cart, setCart] = useState<Array<CartState>>([]);

  const { totalProductPrice, totalShippingPrice } = useMemo(() => {
    const totalProductPrice = sumBy(filter(cart, { checked: true }), (cart) =>
      getSumProductPrice(cart)
    );

    const totalShippingPrice =
      totalProductPrice >= 50000 ? 0 : sumBy(filter(cart, { checked: true }), 'shippingPrice');

    return {
      totalProductPrice,
      totalShippingPrice,
    };
  }, [cart]);

  const isNoSelect = useMemo(() => !some(cart, { checked: true }), [cart]);

  const onCheckboxHandler = (checked: boolean, index: number) => {
    const cloneCart = cloneDeep(cart);
    cloneCart[index].checked = checked;
    setCart(cloneCart);
  };

  const onAllCheckboxHandler = (checked: boolean) => {
    setCart((prev) => map(prev, (item) => ({ ...item, checked })));
  };

  function addCheckParamToCartList(cartList: Cart[]) {
    return map(cartList, (cart) => ({ ...cart, checked: false }));
  }

  const onDeleteCart = async (cartId: string, optionId: string, index: number) => {
    const confirmed = await showConfirmAlert({
      title: '안내',
      description: '해당 상품을 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
    });

    if (!confirmed) return;

    if (isLoggedIn) {
      deleteCartMutate({ cartId, optionId });
    } else {
      setCartStore(removeCartItem(cartStore, optionId, index));
    }

    setCart((prev) => removeCartItem<CartState>(prev, optionId, index));
  };

  function removeCartItem<T extends Cart>(items: Array<T>, optionId: string, index: number) {
    const copyCart = cloneDeep(items);

    if (optionId) {
      copyCart[index].options = reject(copyCart[index].options, { optionId });
    }

    if ((!copyCart[index].quantity && isEmpty(copyCart[index].options)) || !optionId) {
      copyCart.splice(index, 1);
    }

    return copyCart;
  }

  const onDeleteCartList = async () => {
    const confirmed = await showConfirmAlert({
      title: '안내',
      description: '선택한 상품을 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
    });

    if (!confirmed) return;

    const selectedCart = filter(cart, { checked: true });
    if (isLoggedIn) {
      deleteCartListMutate(map(selectedCart, 'productId'));
    } else {
      setCartStore(
        cloneDeep(cartStore).filter(({ productId }) => !some(selectedCart, { productId }))
      );
    }

    setCart(filter(cart, { checked: false }));
  };

  const onUpdateCartQuantity = async (
    productId: string,
    optionId: string,
    quantity: number,
    index: number,
    optionRequired: boolean,
    quantityDelta: number
  ) => {
    const payload: AddToCartRequest = { productId, optionId, quantity: quantityDelta };

    if (isLoggedIn) {
      if (!isPendingAddToCart) addToCartAsync(payload);
    } else {
      const cloneCartStore = cloneDeep(cartStore);
      if (optionRequired) {
        const optionIndex = findIndex(cloneCartStore[index].options, { optionId });
        cartStore[index].options[optionIndex].quantity = quantity + quantityDelta;
      } else {
        cloneCartStore[index].quantity = quantity + quantityDelta;
      }
      setCartStore(cloneCartStore);
    }

    const cloneCart = cloneDeep(cart);
    if (optionRequired) {
      const optionIndex = findIndex(cloneCart[index].options, { optionId });
      cloneCart[index].options[optionIndex].quantity = quantity + quantityDelta;
    } else {
      cloneCart[index].quantity = quantity + quantityDelta;
    }

    setCart(cloneCart);
  };

  const moveToOrderPage = async () => {
    if (!isLoggedIn) {
      setPurchaseGuideModalOpen(true);
      return;
    }

    const payload = filter(cart, { checked: true }).map(({ productId, quantity }) => ({
      productId,
      quantity,
    }));

    const { data: sessionId } = await createPaymentSessionAsync(payload);

    forward(`/payment?sessionId=${sessionId}`);
  };

  const moveToLoginPage = () => {
    setRedirectUrl('/cart');
    forward('/login');
  };

  function getSumProductPrice(item: Cart) {
    const { price, quantity, options } = item;

    return (
      price * quantity +
      sumBy(options, ({ optionPrice, quantity: optionQuantity }) => optionPrice * optionQuantity)
    );
  }

  const getShippingPrice = (item: Cart) => {
    const { shippingPrice } = item;
    if (getSumProductPrice(item) >= FREE_SHIPPING_THRESHOLD) {
      return 0;
    }

    return shippingPrice;
  };

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!isLoggedIn) {
      setCart(addCheckParamToCartList(cartStore));
      return;
    }

    if (cartListError) {
      toast.error('장바구니 목록을 불러오는데 실패하였습니다.');
      return;
    }

    if (cartListData) {
      const { data } = cartListData;
      setCart(addCheckParamToCartList(data));
    }
  }, [cartListData, isLoggedIn, _hasHydrated]);

  useEffect(() => {
    router.prefetch('/payment');
    router.prefetch('/login');
  }, [router]);

  return (
    <Provider
      state={{ cart, isNoSelect, totalProductPrice, totalShippingPrice }}
      controller={{
        moveToOrderPage,
        onAllCheckboxHandler,
        onDeleteCartList,
        onCheckboxHandler,
        onUpdateCartQuantity,
        onDeleteCart,
        getSumProductPrice,
        getShippingPrice,
      }}
    >
      <ResponsiveFrame
        mobileComponent={<CartModileView />}
        webComponent={<CartWebView />}
        breakpoint={Breakpoint.LG}
      />
      {/* 비로그인시 구매가이드 모달 */}
      <PurchaseGuideModal
        modalOpen={purchaseGuideModalOpen}
        setModalOpen={setPurchaseGuideModalOpen}
        moveToLoginPage={moveToLoginPage}
      />
    </Provider>
  );
};

export default CartContainer;
