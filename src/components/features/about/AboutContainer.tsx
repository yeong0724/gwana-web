'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import AboutMobileView from '@/components/features/about/AboutMobileView';
import AboutWebView from '@/components/features/about/AboutWebView';
import useIsMobile from '@/hooks/useIsMobile';

const AboutContainer = () => {
  const router = useRouter();
  const { isMobile } = useIsMobile();

  useEffect(() => {
    router.prefetch('/product?category=all');
  }, [router]);

  if (isMobile === null) return null;

  return isMobile ? <AboutMobileView /> : <AboutWebView />;
};

export default AboutContainer;
