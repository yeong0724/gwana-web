import { CustomHeader } from '@/components/common';
import LoginContainer from '@/components/features/login/LoginContainer';

const page = () => {
  return (
    <div className="h-dvh bg-gray-50 flex flex-col relative overflow-hidden">
      <CustomHeader title="로그인" />
      <LoginContainer />
    </div>
  );
};

export default page;
