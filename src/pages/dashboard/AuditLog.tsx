import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Boxes, Rocket, Search, ShieldCheck, Terminal, UserCog } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAuditLog, type AuditCategory } from '@/hooks/useAuditLog';

const FILTERS: { key: AuditCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All activity' },
  { key: 'deployment', label: 'Deployments' },
  { key: 'application', label: 'Config changes' },
  { key: 'account', label: 'Account' },
  { key: 'system', label: 'System' },
];

const ICONS: Record<string, typeof Rocket> = {
  deployment: Rocket,
  application: Boxes,
  account: UserCog,
  system: Terminal,
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString([], {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

const AuditLog = () => {
  const [category, setCategory] = useState<AuditCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const { data: entries = [], isLoading } = useAuditLog(category, search);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof entries>();
    entries.forEach((e) => {
      const day = new Date(e.created_at).toDateString();
      map.set(day, [...(map.get(day) ?? []), e]);
    });
    return [...map.entries()];
  }, [entries]);

  return (
    <DashboardLayout title="Audit log" subtitle="Every deployment, config change and account action — timestamped">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setCategory(f.key)}
              className={cn(
                'rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors',
                category === f.key
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search actions…"
            className="pl-9"
          />
        </div>
      </div>

      <section className="surface mt-4 p-5">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <ShieldCheck className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(([day, items]) => (
              <div key={day}>
                <p className="eyebrow mb-3">{day}</p>
                <ol className="relative space-y-1 border-l border-border pl-5">
                  {items.map((e, i) => {
                    const Icon = ICONS[e.category] ?? Terminal;
                    return (
                      <motion.li
                        key={e.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, delay: Math.min(i * 0.02, 0.2) }}
                        className="group relative rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary/60"
                      >
                        <span className="absolute -left-[27px] top-4 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-border bg-background transition-colors group-hover:border-primary">
                          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground transition-colors group-hover:bg-primary" />
                        </span>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <Icon className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                          <span className="text-sm">{e.action}</span>
                          {e.target && (
                            <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                              {e.target}
                            </span>
                          )}
                          <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                            {fmt(e.created_at)}
                          </span>
                        </div>
                        {Object.keys(e.metadata ?? {}).length > 0 && (
                          <p className="mt-1 pl-7 font-mono text-[11px] text-muted-foreground">
                            {Object.entries(e.metadata)
                              .map(([k, v]) => `${k}=${String(v)}`)
                              .join('  ')}
                          </p>
                        )}
                      </motion.li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
};

export default AuditLog;