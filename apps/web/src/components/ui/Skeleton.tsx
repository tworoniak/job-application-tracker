export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-xl bg-[rgba(0,0,0,0.06)] ${className}`}
  />
)

export const TableSkeleton = ({ rows = 8 }: { rows?: number }) => (
  <div className="space-y-px">
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-14 w-full rounded-none first:rounded-t-xl last:rounded-b-xl" />
    ))}
  </div>
)
