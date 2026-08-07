import { Area, AreaChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Cpu, MemoryStick, Timer, Zap } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { useLiveMetrics } from '@/hooks/useLiveMetrics';
import { useApplications } from '@/hooks/useApplications';

const tooltipStyle = {
  background: 'hsl(var(--popover))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 10,
  fontSize: 12,
};

const axis = { fontSize: 10, fill: 'hsl(var(--muted-foreground))' };

const Monitoring = () => {
  const metrics = useLiveMetrics(48, 1500);
  const { data: apps = [] } = useApplications();
  const last = metrics[metrics.length - 1];

  return (
    <DashboardLayout title="Monitoring" subtitle="Streaming telemetry · 1.5s resolution">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Cpu} label="CPU" value={`${Math.round(last.cpu)}%`} hint="cluster average" />
        <StatCard icon={MemoryStick} label="Memory" value={`${Math.round(last.memory)}%`} hint="allocated" />
        <StatCard icon={Zap} label="Throughput" value={`${last.requests}`} hint="requests / sec" />
        <StatCard icon={Timer} label="P95 latency" value={`${last.latency}ms`} hint="edge to origin" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="surface p-5">
          <h2 className="mb-4 font-display text-sm uppercase">CPU vs memory</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics} margin={{ left: -22, right: 6, top: 6 }}>
                <XAxis dataKey="label" tick={axis} tickLine={false} axisLine={false} minTickGap={44} />
                <YAxis tick={axis} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="cpu" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="memory" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="surface p-5">
          <h2 className="mb-4 font-display text-sm uppercase">Latency</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics} margin={{ left: -22, right: 6, top: 6 }}>
                <defs>
                  <linearGradient id="latFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={axis} tickLine={false} axisLine={false} minTickGap={44} />
                <YAxis tick={axis} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="latency" stroke="hsl(var(--warning))" strokeWidth={2} fill="url(#latFill)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="surface mt-4 p-5">
        <h2 className="mb-4 font-display text-sm uppercase">Per-application load</h2>
        {apps.length ? (
          <div className="space-y-4">
            {apps.map((a, i) => {
              const load = Math.round(Math.min(98, last.cpu * (0.6 + ((i % 4) + 1) * 0.15)));
              return (
                <div key={a.id}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="truncate">{a.name}</span>
                    <span className="font-mono text-muted-foreground">{load}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${load}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No applications to monitor yet.</p>
        )}
      </section>
    </DashboardLayout>
  );
};

export default Monitoring;
