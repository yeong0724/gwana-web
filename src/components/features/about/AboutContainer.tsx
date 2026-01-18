'use client';

import AboutMobileView from '@/components/features/about/AboutMobileView';
import AboutWebView from '@/components/features/about/AboutWebView';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AboutContainer = () => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/product?category=all');
  }, [router]);

  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile === null) return null;

  return isMobile ? <AboutMobileView /> : <AboutWebView />;
};

export default AboutContainer;
