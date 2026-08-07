import { useMemo, useState } from 'react';
import { ChevronDown, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApplications, useDeployments, useTriggerDeploy } from '@/hooks/useApplications';
import { cn } from '@/lib/utils';

const relative = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
};

const Deployments = () => {
  const { data: apps = [] } = useApplications();
  const [filter, setFilter] = useState('all');
  const { data: deployments = [], isLoading } = useDeployments(filter === 'all' ? undefined : filter);
  const deploy = useTriggerDeploy();
  const [open, setOpen] = useState<string | null>(null);

  const isLive = deployments.some((d) => d.status === 'deploying');
  const appMap = useMemo(() => Object.fromEntries(apps.map((a) => [a.id, a])), [apps]);
  const selected = apps.find((a) => a.id === filter);

  return (
    <DashboardLayout
      title="Deployments"
      subtitle={isLive ? 'Rollout in progress…' : 'Rollout history and logs'}
      actions={
        selected ? (
          <Button size="sm" disabled={deploy.isPending} onClick={() => deploy.mutate({ app: selected })}>
            <Rocket className="h-4 w-4" /> Redeploy
          </Button>
        ) : null
      }
    >
      <div className="mb-4 max-w-xs">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger><SelectValue placeholder="All applications" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All applications</SelectItem>
            {apps.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : deployments.length ? (
        <div className="space-y-3">
          {deployments.map((d) => {
            const expanded = open === d.id;
            return (
              <div key={d.id} className="surface overflow-hidden">
                <button
                  onClick={() => setOpen(expanded ? null : d.id)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-secondary/40"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {appMap[d.application_id]?.name ?? 'Application'}{' '}
                      <span className="font-mono text-xs text-muted-foreground">{d.version}</span>
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {d.commit_message} · {relative(d.created_at)}
                      {d.duration_seconds ? ` · ${d.duration_seconds}s` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={d.status} />
                    <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', expanded && 'rotate-180')} />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden border-t border-border"
                    >
                      <pre className="max-h-72 overflow-auto bg-muted/30 p-4 font-mono text-[11px] leading-relaxed">
                        {(d.logs ?? []).map((line, i) => (
                          <div key={i} className={line.startsWith('✓') ? 'text-success' : line.startsWith('→') ? 'text-primary' : ''}>
                            {line}
                          </div>
                        ))}
                        {d.status === 'deploying' && <div className="animate-pulse text-warning">… streaming</div>}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="surface p-14 text-center">
          <p className="font-display text-lg uppercase">No deployments</p>
          <p className="mt-2 text-sm text-muted-foreground">Trigger a deploy from the Applications page.</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Deployments;
