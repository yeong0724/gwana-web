import { useRouter } from 'next/navigation';

import { getIsMobile } from '@/lib/utils';

const useNativeRouter = () => {
  const router = useRouter();
  const isMobile = getIsMobile();

  const slideAnimation = (direction: 'forward' | 'backward') => {
    const isForward = direction === 'forward';

    document.documentElement.animate(
      [
        { transform: 'translateX(0)' },
        { transform: `translateX(${isForward ? '-100%' : '100%'})` },
      ],
      {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards',
        pseudoElement: '::view-transition-old(root)',
      }
    );

    document.documentElement.animate(
      [
        { transform: `translateX(${isForward ? '100%' : '-100%'})` },
        { transform: 'translateX(0)' },
      ],
      {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  };

  const forward = (path: string) => {
    if (!isMobile || !document.startViewTransition) {
      router.push(path);
      return;
    }

    const transition = document.startViewTransition(() => {
      router.push(path);
    });

    transition.ready.then(() => slideAnimation('forward'));
  };

  const backward = () => {
    if (!isMobile || !document.startViewTransition) {
      router.back();
      return;
    }

    const transition = document.startViewTransition(() => {
      window.history.back();
    });

    transition.ready.then(() => slideAnimation('backward'));
  };

  return { forward, backward };
};

export default useNativeRouter;
