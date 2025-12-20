/**
 * View Transitions API TypeScript 타입 선언
 * @see https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
 */

interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
}

interface Document {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition;
}
