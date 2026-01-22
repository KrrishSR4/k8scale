import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: LoadingSkeletonProps) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-muted',
        className
      )}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="w-12 h-12 rounded-xl" />
      </div>
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <div className="flex items-center gap-4 py-4 px-4 border-b border-border">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-5 w-28" />
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="glass-card p-6">
      <Skeleton className="h-5 w-32 mb-4" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
};