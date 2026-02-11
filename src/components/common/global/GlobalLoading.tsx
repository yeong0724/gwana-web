'use client';

import Image from 'next/image';

import { useIsMutating } from '@tanstack/react-query';

const GlobalLoading = () => {
  const isMutating = useIsMutating({
    predicate: (mutation) => {
      // refreshAccessToken은 로딩 표시에서 제외
      const mutationKey = mutation.options.mutationKey;
      return !(Array.isArray(mutationKey) && mutationKey[0] === 'refreshAccessToken');
    },
  });

  if (!isMutating) return null;

  const variant: 'default' | 'smooth' | 'fast' | 'wobble' = 'default';
  const animationClass = {
    default: 'animate-spin-y',
    smooth: 'animate-spin-smooth',
    fast: 'animate-spin-fast',
    wobble: 'animate-spin-wobble',
  }[variant];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/15">
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center" style={{ perspective: '500px' }}>
          <Image
            src="/images/leaf.webp"
            alt="loading"
            width={72}
            height={72}
            className={animationClass}
            style={{ transformStyle: 'preserve-3d' }}
          />
          {/* {showShadow && (
          <div
            className="mt-2 rounded-full bg-black/10 animate-shadow-pulse"
            style={{
              width: size * 0.7,
              height: size * 0.15,
            }}
          />
        )} */}
        </div>
        {true && (
          <span className="text-sm text-green-700 tracking-wide animate-text-fade">Loading...</span>
        )}
      </div>
    </div>
  );
};

export default GlobalLoading;
