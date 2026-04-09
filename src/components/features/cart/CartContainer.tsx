'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { cloneDeep, filter, isEmpty, map, some, sumBy } from 'lodash-es';
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
      totalProductPrice >= FREE_SHIPPING_THRESHOLD
        ? 0
        : sumBy(filter(cart, { checked: true }), 'shippingPrice');

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

  const onDeleteCart = async (cartItemId: string, index: number, cartItemIndex: number) => {
    const confirmed = await showConfirmAlert({
      title: '안내',
      description: '해당 상품을 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
    });

    if (!confirmed) return;

    const newCart = removeCartItem<CartState>(cart, index, cartItemIndex);
    const shouldRemoveCart = isEmpty(filter(newCart[index].cartItems, { isRequired: true }));

    if (shouldRemoveCart) {
      setCart((prev) => prev.filter((_, i) => i !== index));
    } else {
      setCart(newCart);
    }

    if (isLoggedIn) {
      deleteCartMutate({ cartItemId });
    } else {
      if (shouldRemoveCart) {
        const copyCartStore = cloneDeep(cartStore);
        copyCartStore.splice(index, 1);
        setCartStore(copyCartStore);
      } else {
        setCartStore(removeCartItem(cartStore, index, cartItemIndex));
      }
    }
  };

  function removeCartItem<T extends Cart>(items: Array<T>, index: number, cartItemIndex: number) {
    const copyCart = cloneDeep(items);
    copyCart[index].cartItems.splice(cartItemIndex, 1);
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
    cartItemId: string,
    index: number,
    cartItemIndex: number,
    quantity: number,
    quantityDelta: number
  ) => {
    const payload: AddToCartRequest = { cartItemId, quantity: quantityDelta };

    if (isLoggedIn) {
      if (!isPendingAddToCart) addToCartAsync(payload);
    } else {
      const cloneCartStore = cloneDeep(cartStore);
      cloneCartStore[index].cartItems[cartItemIndex].quantity = quantity + quantityDelta;
      setCartStore(cloneCartStore);
    }

    const cloneCart = cloneDeep(cart);
    cloneCart[index].cartItems[cartItemIndex].quantity = quantity + quantityDelta;
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
    const { cartItems } = item;
    return sumBy(cartItems, ({ optionPrice, quantity }) => optionPrice * quantity);
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
