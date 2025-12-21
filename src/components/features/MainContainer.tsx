'use client';

import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const MainContainer = ({ children }: Props) => {
  // const { setLoginInfo, loginInfo, _hasHydrated } = useLoginStore();
  // const { useRefreshAccessToken } = useLoginService();

  // const { mutateAsync: refreshAccessTokenMutate } = useRefreshAccessToken();

  // const onCheckLoginStatus = async () => {
  //   const { accessToken } = loginInfo;
  //   if (!accessToken) {
  //     setLoginInfo({ isLogin: false, accessToken });
  //     return;
  //   }

  //   // Access Token이 아직 유효한 경우
  //   if (validateToken(accessToken)) {
  //     onLoginSuccess(accessToken);
  //     return;
  //   }

  //   // Access Token 만료 시 갱신 시도
  //   try {
  //     const { code, data } = await refreshAccessTokenMutate({ accessToken });
  //     if (code === ResultCode.SUCCESS) {
  //       onLoginSuccess(data);
  //     } else {
  //       allClearPersistStore();
  //     }
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   } catch (error) {
  //     allClearPersistStore();
  //   }
  // };

  // const onLoginSuccess = async (accessToken: string) => {
  //   setLoginInfo({ isLogin: true, accessToken });
  // };

  // useEffect(() => {
  //   // hydration이 완료된 후에만 로그인 체크 수행
  //   if (_hasHydrated) {
  //     onCheckLoginStatus();
  //   }
  // }, [_hasHydrated]);

  return <>{children}</>;
};

export default MainContainer;
