import { useEffect, RefObject } from 'react';

interface UseIntersectionObserverProps {
  target: RefObject<Element | null>;
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
}

export const useIntersectionObserver = ({
  target,
  onIntersect,
  enabled = true,
  rootMargin = '0px',
  threshold = 1.0,
}: UseIntersectionObserverProps) => {
  useEffect(() => {
    if (!enabled) return;

    const el = target.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && onIntersect()),
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [target, enabled, rootMargin, threshold, onIntersect]);
};
export default useIntersectionObserver;
