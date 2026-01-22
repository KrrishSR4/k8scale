import { cn } from '@/lib/utils';

type Status = 'running' | 'failed' | 'deploying' | 'success' | 'in-progress';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  running: {
    label: 'Running',
    className: 'bg-success/20 text-success border-success/30',
  },
  success: {
    label: 'Success',
    className: 'bg-success/20 text-success border-success/30',
  },
  failed: {
    label: 'Failed',
    className: 'bg-destructive/20 text-destructive border-destructive/30',
  },
  deploying: {
    label: 'Deploying',
    className: 'bg-warning/20 text-warning border-warning/30',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-warning/20 text-warning border-warning/30',
  },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          status === 'running' || status === 'success' ? 'bg-success' : '',
          status === 'failed' ? 'bg-destructive' : '',
          (status === 'deploying' || status === 'in-progress') && 'bg-warning animate-pulse'
        )}
      />
      {config.label}
    </span>
  );
};

export default StatusBadge;