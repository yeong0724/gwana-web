import { CustomHeader } from '@/components/common';
import CartContainer from '@/components/features/cart/CartContainer';

const Page = () => {
  return (
    <div className="h-dvh bg-gray-50 flex flex-col relative overflow-hidden">
      <CustomHeader title="장바구니" />
      <CartContainer />
    </div>
  );
};

export default Page;
