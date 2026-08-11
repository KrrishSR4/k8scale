import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const map: Record<string, string> = {
  running: 'status-running',
  success: 'status-running',
  deploying: 'status-deploying',
  building: 'status-deploying',
  pending: 'status-deploying',
  failed: 'status-failed',
  paused: 'status-paused',
};

const StatusBadge = ({ status, className }: { status: string; className?: string }) => {
  const active = status === 'deploying' || status === 'building' || status === 'pending';
  const live = status === 'running' || status === 'success';

  return (
    <motion.span
      key={status}
      initial={{ opacity: 0, scale: 0.9, y: -2 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 380, damping: 24 }}
      className={cn(
        'relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest',
        map[status] ?? 'status-paused',
        className,
      )}
    >
      {active && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[sheen_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-current/20 to-transparent" />
      )}
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {(live || active) && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
        )}
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      <span className="relative">{status}</span>
    </motion.span>
  );
};

export default StatusBadge;
