export function FeaturedSellersSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className="flex gap-4 overflow-x-hidden">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="w-[260px] rounded-2xl border border-border bg-card p-4 animate-pulse shrink-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-muted flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="h-3 bg-muted rounded w-2/3 mb-2" />
              <div className="h-3 bg-muted rounded w-1/3" />
            </div>
          </div>
          <div className="h-3 bg-muted rounded w-1/4 mt-4" />
        </div>
      ))}
    </div>
  );
}
