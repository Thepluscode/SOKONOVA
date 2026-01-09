interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'text' | 'avatar' | 'image';
  count?: number;
  className?: string;
}

export default function SkeletonLoader({ 
  type = 'card', 
  count = 1,
  className = '' 
}: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
            <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse mb-4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-4"></div>
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className={`bg-white rounded-lg border border-gray-200 p-4 flex items-center space-x-4 ${className}`}>
            <div className="w-16 h-16 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className={className}>
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
          </div>
        );
      
      case 'avatar':
        return (
          <div className={`w-12 h-12 bg-gray-200 rounded-full animate-pulse ${className}`}></div>
        );
      
      case 'image':
        return (
          <div className={`w-full h-64 bg-gray-200 rounded-lg animate-pulse ${className}`}></div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}
