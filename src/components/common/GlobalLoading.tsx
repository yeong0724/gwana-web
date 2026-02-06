'use client';

import { useIsMutating } from '@tanstack/react-query';

import TeaLeafLoader from '@/components/common/TeaLeafLoader';

const GlobalLoading = () => {
  const isMutating = useIsMutating({
    predicate: (mutation) => {
      // refreshAccessToken은 로딩 표시에서 제외
      const mutationKey = mutation.options.mutationKey;
      return !(Array.isArray(mutationKey) && mutationKey[0] === 'refreshAccessToken');
    },
  });

  if (!isMutating) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/15">
      <TeaLeafLoader variant="smooth" size={72} showText text="Loading..." />
    </div>
  );
};

export default GlobalLoading;
