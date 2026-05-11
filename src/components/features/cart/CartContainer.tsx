'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { cloneDeep, filter, isEmpty, map, omit, some, sumBy } from 'lodash-es';
import { toast } from 'sonner';

import { ResponsiveFrame } from '@/components/common/frame';
import { PurchaseGuideModal } from '@/components/common/modal';
import CartModileView from '@/components/features/cart/CartModileView';
import CartWebView from '@/components/features/cart/CartWebView';
import { Provider } from '@/context/cartContext';
import useNativeRouter from '@/hooks/useNativeRouter';
import { asyncFn, setRedirectUrl } from '@/lib/utils';
import { useCartService, useOrderService } from '@/service';
import { useAlertStore, useCartStore, useLoginStore } from '@/stores';
import { Breakpoint, Cart, CartState, UpdateCartItemQuantityRequest } from '@/types';

const FREE_SHIPPING_THRESHOLD = 50000;

const CartContainer = () => {
  const router = useRouter();
  const { forward } = useNativeRouter();
  const { cart: cartStore, setCart: setCartStore, _hasHydrated } = useCartStore();
  const { isLoggedIn } = useLoginStore();
  const { showConfirmAlert } = useAlertStore();
  const [purchaseGuideModalOpen, setPurchaseGuideModalOpen] = useState<boolean>(false);

  const {
    useDeleteCartItemMutation,
    useDeleteCartMutation,
    useDeleteCartListMutation,
    useGetCartListQuery,
    useUpdateCartItemQuantityMutation,
  } = useCartService();

  const { useCreateOrderMutation } = useOrderService();

  const { data: cartListData, error: cartListError } = useGetCartListQuery({
    enabled: isLoggedIn,
  });

  const { mutateAsync: deleteCartItemAsync } = useDeleteCartItemMutation();
  const { mutateAsync: deleteCartAsync } = useDeleteCartMutation();
  const { mutateAsync: deleteCartListAsync } = useDeleteCartListMutation();
  const { mutateAsync: updateCartItemQuantityAsync } = useUpdateCartItemQuantityMutation();
  const { mutateAsync: createOrderAsync } = useCreateOrderMutation();

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

  const onDeleteCart = async (
    cartId: string,
    cartItemId: string,
    index: number,
    cartItemIndex: number
  ) => {
    const newCart = removeCartItem<CartState>(cart, index, cartItemIndex);

    /**
     * shouldRemoveCart: 해당 상품이 필수 옵션만 남아있는지 여부 (true: 선택옵션만 남은 경우)
     * - 선택 옵션만 남는 경우는 해당 장바구니 상품은 삭제
     */
    const shouldRemoveCart = isEmpty(filter(newCart[index].cartItems, { isRequired: true }));

    if (shouldRemoveCart) {
      const confirmed = await showConfirmAlert({
        title: '안내',
        description: '해당 상품을 장바구니에서 삭제하시겠습니까?',
        confirmText: '삭제',
        cancelText: '취소',
      });

      if (!confirmed) return;

      setCart((prev) => prev.filter((_, i) => i !== index));
    } else {
      setCart(newCart);
    }

    if (isLoggedIn) {
      if (shouldRemoveCart) {
        asyncFn(deleteCartAsync({ cartId }));
      } else {
        asyncFn(deleteCartItemAsync({ cartItemId }));
      }
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
      const [error] = await asyncFn(deleteCartListAsync(map(selectedCart, 'cartId')));
      if (error) return;
    } else {
      setCartStore(cloneDeep(cartStore).filter(({ cartId }) => !some(selectedCart, { cartId })));
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
    const updatedQuantity = quantity + quantityDelta;

    const payload: UpdateCartItemQuantityRequest = {
      cartItemId,
      quantity: updatedQuantity,
    };

    if (isLoggedIn) {
      asyncFn(updateCartItemQuantityAsync(payload));
    } else {
      const cloneCartStore = cloneDeep(cartStore);
      cloneCartStore[index].cartItems[cartItemIndex].quantity = updatedQuantity;
      setCartStore(cloneCartStore);
    }

    const cloneCart = cloneDeep(cart);
    cloneCart[index].cartItems[cartItemIndex].quantity = updatedQuantity;
    setCart(cloneCart);
  };

  const moveToOrderPage = async () => {
    if (!isLoggedIn) {
      setPurchaseGuideModalOpen(true);
      return;
    }

    const payload = filter(cart, { checked: true }).map((item) => omit(item, 'checked')) as Cart[];

    const [error, data] = await asyncFn(createOrderAsync(payload));

    if (error) return;

    const { data: orderId } = data;

    // 0QAFK7BMVJRXQ
    forward(`/payment?orderId=${orderId}`);
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
        webClassName="lg:flex-1 lg:min-h-0 lg:overflow-y-scroll"
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
