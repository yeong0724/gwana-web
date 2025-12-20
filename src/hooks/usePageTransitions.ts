'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';

import { TransitionsContext } from '@/providers/TransitionProvider';
import { FlowType } from '@/types';

export function usePageTransitions() {
  const transitionContext = useContext(TransitionsContext);
  const router = useRouter();

  if (!transitionContext) {
    throw new Error('You are attempting to use usePageTransitions outside of a TransitionContext.');
  }

  const context = transitionContext;

  /**
   * View Transitions API를 사용한 동시 슬라이드 전환
   * 이전 페이지와 새 페이지가 동시에 아웃/인 됩니다.
   */
  function navigateWithTransition(url: string, flowType: FlowType): void {
    context.flowType.current = flowType;

    // View Transitions API 지원 확인
    if (document.startViewTransition) {
      // 전환 방향에 따라 클래스 설정
      document.documentElement.classList.add(
        flowType === FlowType.Next ? 'slide-forward' : 'slide-backward'
      );

      const transition = document.startViewTransition(() => {
        router.push(url);
      });

      transition.finished.then(() => {
        document.documentElement.classList.remove('slide-forward', 'slide-backward');
        context.flowType.current = null;
      });
    } else {
      // View Transitions 미지원 브라우저: 기존 방식 fallback
      hide(flowType).then(() => {
        router.push(url);
      });
    }
  }

  /**
   * Triggers the animation to hide the page (fallback용).
   */
  function hide(flowType: FlowType): Promise<void> {
    return new Promise((resolve) => {
      const className = getHideAnimation(flowType);
      context.setClassName(className);
      context.flowType.current = flowType;
      setTimeout(resolve, context.animationDuration);
    });
  }

  /** Triggers the animation to show the page (fallback용). */
  function show() {
    // View Transitions API 사용 시 show()는 자동 처리됨
    if (document.startViewTransition && context.flowType.current) {
      context.flowType.current = null;
      return;
    }

    if (context.flowType.current) {
      const animation = getShowAnimation(context.flowType.current);
      context.setClassName(animation);

      setTimeout(() => {
        context.setClassName('');
        context.flowType.current = null;
      }, context.animationDuration);
    }
  }

  /**
   * View Transitions API를 사용한 뒤로가기 전환
   */
  function goBackWithTransition(): void {
    context.flowType.current = FlowType.Previous;

    if (document.startViewTransition) {
      document.documentElement.classList.add('slide-backward');

      const transition = document.startViewTransition(() => {
        router.back();
      });

      transition.finished.then(() => {
        document.documentElement.classList.remove('slide-backward');
        context.flowType.current = null;
      });
    } else {
      hide(FlowType.Previous).then(() => {
        router.back();
      });
    }
  }

  /** Resets the transition state. */
  function reset() {
    context.setClassName('');
    context.flowType.current = null;
  }

  return { navigateWithTransition, goBackWithTransition, hide, show, reset };
}

// Private helper functions

/** Gets the CSS class required to hide the page. */
function getHideAnimation(flowType: FlowType) {
  return flowType === FlowType.Next ? 'animate-slide-left-out' : 'animate-slide-right-out';
}

/** Gets the CSS class required to show the page. */
function getShowAnimation(flowType: FlowType) {
  return flowType === FlowType.Next ? 'animate-slide-left-in' : 'animate-slide-right-in';
}
