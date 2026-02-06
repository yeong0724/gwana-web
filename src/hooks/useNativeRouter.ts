import { useRouter } from 'next/navigation';

import useIsMobile from './useIsMobile';

const useNativeRouter = () => {
  const router = useRouter();
  const { isMobile } = useIsMobile();
  const slideAnimation = (direction: 'forward' | 'backward') => {
    const isForward = direction === 'forward';

    document.documentElement.animate(
      [
        { transform: 'translateX(0)' },
        { transform: `translateX(${isForward ? '-100%' : '100%'})` },
      ],
      {
        duration: 600,
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
        duration: 600,
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
      router.back();
    });

    transition.ready.then(() => slideAnimation('backward'));

    // View Transition 완료 후 이벤트 발생
    transition.finished.then(() => {
      window.dispatchEvent(new CustomEvent('viewTransitionComplete'));
    });
  };

  return { forward, backward };
};

export default useNativeRouter;
