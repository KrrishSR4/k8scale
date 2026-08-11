import { cn } from '@/lib/utils';

/** Shimmering placeholder block used while dashboard data loads. */
export const Shimmer = ({ className }: { className?: string }) => (
  <div className={cn('shimmer rounded-md bg-muted/60', className)} />
);

export const StatCardSkeleton = () => (
  <div className="surface space-y-4 p-5">
    <div className="flex items-center justify-between">
      <Shimmer className="h-3 w-24" />
      <Shimmer className="h-8 w-8 rounded-lg" />
    </div>
    <Shimmer className="h-8 w-20" />
    <Shimmer className="h-3 w-28" />
  </div>
);

export const CardSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <div className="surface space-y-3 p-5">
    <div className="flex items-start justify-between gap-3">
      <Shimmer className="h-4 w-32" />
      <Shimmer className="h-4 w-16 rounded-full" />
    </div>
    {Array.from({ length: lines }).map((_, i) => (
      <Shimmer key={i} className={i === lines - 1 ? 'h-3 w-2/3' : 'h-3 w-full'} />
    ))}
    <div className="flex gap-2 pt-2">
      <Shimmer className="h-8 flex-1 rounded-lg" />
      <Shimmer className="h-8 w-8 rounded-lg" />
    </div>
  </div>
);

export const RowSkeleton = () => (
  <div className="surface flex items-center justify-between gap-4 p-4">
    <div className="flex-1 space-y-2">
      <Shimmer className="h-3.5 w-40" />
      <Shimmer className="h-3 w-24" />
    </div>
    <Shimmer className="h-5 w-20 rounded-full" />
  </div>
);

export const ChartSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('surface p-5', className)}>
    <Shimmer className="h-3 w-32" />
    <Shimmer className="mt-4 h-64 rounded-lg" />
  </div>
);
