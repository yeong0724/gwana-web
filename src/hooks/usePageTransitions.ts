'use client';

import { useContext } from 'react';

import { TransitionsContext } from '@/providers/TransitionProvider';
import { FlowType } from '@/types';

export function usePageTransitions() {
  const transitionContext = useContext(TransitionsContext);

  if (!transitionContext) {
    throw new Error('You are attempting to use usePageTransitions outside of a TransitionContext.');
  }

  const context = transitionContext;

  /**
   * Triggers the animation to hide the page.
   *
   * @param {FlowType} [flowType] - The flow direction (`Next` or `Previous`).
   * @returns {Promise<void>} A promise that resolves when the animation completes.
   */
  function hide(flowType: FlowType): Promise<void> {
    return new Promise((resolve) => {
      const className = getHideAnimation(flowType);
      context.setClassName(className);
      context.flowType.current = flowType;

      // Wait for the animation to be completed before resolving the promise
      setTimeout(resolve, context.animationDuration);
    });
  }

  /** Triggers the animation to show the page. */
  function show() {
    if (context.flowType.current) {
      const animation = getShowAnimation(context.flowType.current);
      context.setClassName(animation);

      // 애니메이션 완료 후 상태 초기화
      setTimeout(() => {
        context.setClassName('');
        context.flowType.current = null;
      }, context.animationDuration);
    } else {
      // flowType이 없더라도 클래스네임은 비워줌 (스타일 깨짐 방지)
      context.setClassName('');
    }
  }

  /** Resets the transition state. */
  function reset() {
    context.setClassName('');
    context.flowType.current = null;
  }

  return { hide, show, reset };
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
