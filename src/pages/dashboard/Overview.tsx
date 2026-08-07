import { Link } from 'react-router-dom';
import { Boxes, Rocket, Gauge, Timer, ArrowUpRight } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useApplications, useDeployments } from '@/hooks/useApplications';
import { useLiveMetrics } from '@/hooks/useLiveMetrics';

const Overview = () => {
  const { data: apps = [], isLoading } = useApplications();
  const { data: deployments = [] } = useDeployments();
  const metrics = useLiveMetrics(36, 2000);

  const running = apps.filter((a) => a.status === 'running').length;
  const successes = deployments.filter((d) => d.status === 'success');
  const rate = deployments.length ? Math.round((successes.length / deployments.length) * 100) : 100;
  const avg = successes.length
    ? Math.round(successes.reduce((s, d) => s + (d.duration_seconds ?? 0), 0) / successes.length)
    : 0;
  const latest = metrics[metrics.length - 1];

  return (
    <DashboardLayout
      title="Overview"
      subtitle="Live snapshot of your cluster"
      actions={
        <Link to="/dashboard/applications">
          <Button size="sm">New application</Button>
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[132px] rounded-xl" />)
        ) : (
          <>
            <StatCard icon={Boxes} label="Applications" value={apps.length} hint={`${running} running`} />
            <StatCard icon={Rocket} label="Deployments" value={deployments.length} hint={`${rate}% success rate`} />
            <StatCard icon={Gauge} label="Cluster CPU" value={`${Math.round(latest?.cpu ?? 0)}%`} hint="across all nodes" />
            <StatCard icon={Timer} label="Avg deploy" value={avg ? `${avg}s` : '—'} hint="build to healthy" />
          </>
        )}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="surface p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-sm uppercase">Request throughput</h2>
              <p className="text-xs text-muted-foreground">Streaming · 2s resolution</p>
            </div>
            <span className="font-mono text-xs text-primary">{latest?.requests ?? 0} req/s</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics} margin={{ left: -22, right: 6, top: 6 }}>
                <defs>
                  <linearGradient id="reqFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.42} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} minTickGap={40} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="requests" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#reqFill)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="mb-4 font-display text-sm uppercase">Recent deployments</h2>
          <div className="space-y-3">
            {deployments.slice(0, 6).map((d) => {
              const app = apps.find((a) => a.id === d.application_id);
              return (
                <div key={d.id} className="flex items-center justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm">{app?.name ?? 'Application'}</p>
                    <p className="truncate font-mono text-[11px] text-muted-foreground">{d.version}</p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              );
            })}
            {!deployments.length && (
              <p className="text-sm text-muted-foreground">No deployments yet. Create an app and ship it.</p>
            )}
          </div>
          <Link to="/dashboard/deployments" className="link-underline mt-4 inline-flex items-center gap-1 text-xs text-primary">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="surface mt-4 p-5">
        <h2 className="mb-4 font-display text-sm uppercase">Applications</h2>
        {apps.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {apps.slice(0, 6).map((a) => (
              <Link key={a.id} to="/dashboard/applications" className="surface surface-hover block p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-medium">{a.name}</p>
                  <StatusBadge status={a.status} />
                </div>
                <p className="mt-2 truncate font-mono text-[11px] text-muted-foreground">{a.image}</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {a.region} · {a.replicas} replicas
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No applications yet.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Overview;
