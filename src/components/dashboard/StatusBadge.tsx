import { cn } from '@/lib/utils';

const map: Record<string, string> = {
  running: 'status-running',
  success: 'status-running',
  deploying: 'status-deploying',
  failed: 'status-failed',
  paused: 'status-paused',
};

const StatusBadge = ({ status, className }: { status: string; className?: string }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest',
      map[status] ?? 'status-paused',
      className,
    )}
  >
    <span
      className={cn(
        'h-1.5 w-1.5 rounded-full bg-current',
        (status === 'deploying' || status === 'running') && 'animate-pulse',
      )}
    />
    {status}
  </span>
);

export default StatusBadge;
