import { useCallback, useEffect, useRef } from 'react';

export const useDragScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isProgrammaticScroll = useRef(false); // 추가
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return;

    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
    scrollRef.current.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;

    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // 스크롤 속도 조절
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!scrollRef.current) return;

    isDragging.current = false;
    scrollRef.current.style.cursor = 'grab';
    scrollRef.current.style.userSelect = 'auto';
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!scrollRef.current) return;

    isDragging.current = false;
    scrollRef.current.style.cursor = 'grab';
    scrollRef.current.style.userSelect = 'auto';
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!scrollRef.current) return;

    isDragging.current = true;
    startX.current = e.touches[0].pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  // touchmove는 non-passive event listener로 등록
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleTouchMove = (e: TouchEvent) => {
      // 프로그래매틱 스크롤 중이면 preventDefault 하지 않음
      if (isProgrammaticScroll.current) return;
      if (!isDragging.current || !scrollRef.current) return;

      e.preventDefault();
      const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX.current) * 2;
      scrollRef.current.scrollLeft = scrollLeft.current - walk;
    };

    element.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // 프로그래매틱 스크롤을 위한 함수 추가
  const scrollToElement = useCallback((element: HTMLElement) => {
    if (!scrollRef.current) return;

    isProgrammaticScroll.current = true;

    const tabOffsetLeft = element.offsetLeft;
    const tabWidth = element.offsetWidth;
    const containerWidth = scrollRef.current.offsetWidth;
    const scrollPosition = tabOffsetLeft - containerWidth / 2 + tabWidth / 2;

    scrollRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });

    // 스크롤 완료 후 플래그 해제
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 500);
  }, []);

  return {
    scrollRef,
    scrollToElement,
    dragHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseLeave,
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
  };
};
