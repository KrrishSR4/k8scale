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

export type StreamStatus = 'connecting' | 'live' | 'offline';

const STREAM_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/metrics-stream`;

/**
 * Live cluster telemetry streamed over Server-Sent Events from the edge.
 * Falls back to a local simulator if the stream cannot be reached.
 */
export const useLiveMetrics = (points = 40, intervalMs = 2000, seed = 0) => {
  const [data, setData] = useState<MetricPoint[]>(() => {
    const out: MetricPoint[] = [];
    for (let i = 0; i < points; i++) out.push(nextPoint(out[i - 1], seed));
    return out;
  });
  const [status, setStatus] = useState<StreamStatus>('connecting');
  const paused = useRef(false);

  useEffect(() => {
    const onVisibility = () => {
      paused.current = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    const push = (p: MetricPoint) => setData((prev) => [...prev.slice(1), p]);

    let fallback: ReturnType<typeof setInterval> | undefined;
    const startFallback = () => {
      if (fallback) return;
      setStatus('offline');
      fallback = setInterval(() => {
        if (paused.current) return;
        setData((prev) => [...prev.slice(1), nextPoint(prev[prev.length - 1], seed)]);
      }, intervalMs);
    };

    let source: EventSource | undefined;
    try {
      source = new EventSource(`${STREAM_URL}?interval=${intervalMs}`);
      source.addEventListener('open', () => setStatus('live'));
      source.addEventListener('metric', (e) => {
        if (paused.current) return;
        try {
          const raw = JSON.parse((e as MessageEvent).data) as Omit<MetricPoint, 'label'>;
          setStatus('live');
          push({ ...raw, label: fmt(new Date(raw.t)) });
        } catch {
          /* ignore malformed frame */
        }
      });
      source.addEventListener('error', () => {
        source?.close();
        startFallback();
      });
    } catch {
      startFallback();
    }

    return () => {
      source?.close();
      if (fallback) clearInterval(fallback);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [intervalMs, seed]);

  return { data, status, last: data[data.length - 1] };
};
