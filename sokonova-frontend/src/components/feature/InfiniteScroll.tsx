
import { useEffect, useRef, ReactNode } from 'react';

interface InfiniteScrollProps {
  children: ReactNode;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export default function InfiniteScroll({
  children,
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 200,
}: InfiniteScrollProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0, rootMargin: `${threshold}px` }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, onLoadMore, threshold]);

  return (
    <>
      {children}
      <div ref={observerTarget} className="w-full py-8 flex justify-center">
        {isLoading && (
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-6 h-6 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading more products...</span>
          </div>
        )}
        {!hasMore && !isLoading && (
          <div className="text-center text-gray-500 text-sm">
            <i className="ri-checkbox-circle-line text-emerald-600 mr-2"></i>
            You've reached the end
          </div>
        )}
      </div>
    </>
  );
}
