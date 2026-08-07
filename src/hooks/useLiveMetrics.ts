import { useEffect, useRef, useState } from 'react';

export interface MetricPoint {
  t: number;
  label: string;
  cpu: number;
  memory: number;
  requests: number;
  latency: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const fmt = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const nextPoint = (prev: MetricPoint | undefined, seed: number): MetricPoint => {
  const now = new Date();
  return {
    t: now.getTime(),
    label: fmt(now),
    cpu: clamp((prev?.cpu ?? 38 + seed) + (Math.random() - 0.48) * 9, 6, 96),
    memory: clamp((prev?.memory ?? 52 + seed) + (Math.random() - 0.5) * 5, 12, 94),
    requests: Math.round(clamp((prev?.requests ?? 1400) + (Math.random() - 0.47) * 320, 120, 5200)),
    latency: Math.round(clamp((prev?.latency ?? 84) + (Math.random() - 0.5) * 22, 18, 480)),
  };
};

/** Streaming cluster telemetry, seeded so charts are populated on first paint. */
export const useLiveMetrics = (points = 40, intervalMs = 2000, seed = 0) => {
  const [data, setData] = useState<MetricPoint[]>(() => {
    const out: MetricPoint[] = [];
    for (let i = 0; i < points; i++) out.push(nextPoint(out[i - 1], seed));
    return out;
  });
  const paused = useRef(false);

  useEffect(() => {
    const onVisibility = () => {
      paused.current = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);
    const id = setInterval(() => {
      if (paused.current) return;
      setData((prev) => [...prev.slice(1), nextPoint(prev[prev.length - 1], seed)]);
    }, intervalMs);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [intervalMs, seed]);

  return data;
};
