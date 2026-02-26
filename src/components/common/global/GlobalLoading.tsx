'use client';

import Image from 'next/image';

import { useIsFetching, useIsMutating } from '@tanstack/react-query';

const SPINNER_BARS = 12;
const BAR_COLORS = [
  '#3B82F6',
  '#5B9BF7',
  '#7AB4F8',
  '#93C5F9',
  '#ABCFFA',
  '#BDD8FB',
  '#CFE1FC',
  '#DDE9FD',
  '#E8F0FD',
  '#F0F5FE',
  '#F5F8FE',
  '#F9FBFF',
];

const IosSpinner = ({ size = 48 }: { size?: number }) => (
  <div className="relative" style={{ width: size, height: size }}>
    {Array.from({ length: SPINNER_BARS }, (_, i) => (
      <div key={i} className="ios-spinner-bar" style={{ backgroundColor: BAR_COLORS[i] }} />
    ))}
  </div>
);

const GlobalLoading = () => {
  const isMutating = useIsMutating({
    predicate: (mutation) => {
      const mutationKey = mutation.options.mutationKey;
      return !(Array.isArray(mutationKey) && mutationKey[0] === 'refreshAccessToken');
    },
  });

  const isFetching = useIsFetching();

  if (!isMutating && !isFetching) return null;

  if (isFetching && !isMutating) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <IosSpinner size={48} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/15">
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center" style={{ perspective: '500px' }}>
          <Image
            src="/images/leaf.webp"
            alt="loading"
            width={72}
            height={72}
            className="animate-spin-y"
            style={{ transformStyle: 'preserve-3d' }}
          />
        </div>
        <span className="text-sm text-green-700 tracking-wide animate-text-fade">Loading...</span>
      </div>
    </div>
  );
};

export default GlobalLoading;
