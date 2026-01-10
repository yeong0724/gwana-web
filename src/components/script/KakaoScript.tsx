'use client';

import Script from 'next/script';

interface KakaoAuth {
  authorize: (options: { redirectUri: string; scope?: string }) => void;
  logout: (callback?: () => void) => void;
  getAccessToken: () => string | null;
}

interface KakaoShare {
  sendDefault: (options: Record<string, unknown>) => void;
  sendCustom: (options: { templateId: number; templateArgs?: Record<string, string> }) => void;
}

interface KakaoStatic {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Auth: KakaoAuth;
  Share: KakaoShare;
}

declare global {
  interface Window {
    Kakao: KakaoStatic;
  }
}

function KakaoScript() {
  const kakaoScriptKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY || '';

  const onLoad = () => {
    window.Kakao.init(kakaoScriptKey);
  };

  return <Script src="https://developers.kakao.com/sdk/js/kakao.js" async onLoad={onLoad} />;
}

export default KakaoScript;
