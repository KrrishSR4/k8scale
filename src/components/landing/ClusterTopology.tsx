import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Boxes, Cpu, Network, Ship } from 'lucide-react';
import KubeWheel from '@/components/brand/KubeWheel';
import { cn } from '@/lib/utils';

type PodState = 'pending' | 'running' | 'terminating';

const NODES = [
  { name: 'node-a', zone: 'eu-west-1a' },
  { name: 'node-b', zone: 'eu-west-1b' },
  { name: 'node-c', zone: 'eu-west-1c' },
];

const podTone: Record<PodState, string> = {
  running: 'bg-foreground',
  pending: 'bg-muted-foreground/50',
  terminating: 'bg-muted-foreground/25',
};

const makePods = (n: number): PodState[] =>
  Array.from({ length: n }, (_, i) => (i < 2 ? 'running' : 'pending'));

/**
 * Live cluster topology: a Kubernetes helm at the control plane with worker
 * nodes whose pods are scheduled and scaled by a simulated HPA loop.
 */
const ClusterTopology = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [pods, setPods] = useState<PodState[][]>(() => NODES.map(() => makePods(3)));
  const [cpu, setCpu] = useState(41);

  // HPA loop — CPU pressure drives replica count per node.
  useEffect(() => {
    const id = setInterval(() => {
      setCpu((c) => Math.min(92, Math.max(18, Math.round(c + (Math.random() - 0.45) * 18))));
      setPods((prev) =>
        prev.map((node) =>
          node.map((p) => {
            const r = Math.random();
            if (p === 'pending') return r > 0.25 ? 'running' : 'pending';
            if (p === 'terminating') return r > 0.5 ? 'pending' : 'terminating';
            return r > 0.92 ? 'terminating' : 'running';
          }),
        ),
      );
    }, 1600);
    return () => clearInterval(id);
  }, []);

  // Scale replicas with CPU.
  useEffect(() => {
    const target = cpu > 70 ? 5 : cpu > 45 ? 4 : 3;
    setPods((prev) =>
      prev.map((node) => {
        if (node.length === target) return node;
        if (node.length < target) return [...node, 'pending' as PodState];
        return node.slice(0, -1);
      }),
    );
  }, [cpu]);

  // Subtle 3D tilt on pointer.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, { rotateY: x * 7, rotateX: -y * 7, duration: 0.6, ease: 'power2.out' });
    };
    const onLeave = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' });
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const replicas = pods[0]?.length ?? 3;
  const ready = pods.flat().filter((p) => p === 'running').length;

  return (
    <div ref={panelRef} className="surface overflow-hidden shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]">
      {/* header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <KubeWheel className="h-4 w-4 text-primary" strokeWidth={6} detailed={false} />
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            cluster / prod-eu-west-1
          </span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
          healthy
        </span>
      </div>

      {/* control plane */}
      <div className="relative flex items-center gap-4 border-b border-border px-5 py-5">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
        <div className="relative">
          <div className="absolute inset-0 animate-[spin_18s_linear_infinite] text-primary/25">
            <KubeWheel strokeWidth={3} />
          </div>
          <div className="relative h-14 w-14 p-2 text-primary">
            <KubeWheel strokeWidth={4} />
          </div>
        </div>
        <div className="relative">
          <p className="font-display text-sm uppercase">Control plane</p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            kube-apiserver · scheduler · etcd · v1.31.2
          </p>
        </div>
      </div>

      {/* workers */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        {NODES.map((n, ni) => (
          <div key={n.name} className="px-3 py-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{n.name}</p>
            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/60">{n.zone}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {pods[ni].map((p, pi) => (
                <motion.span
                  key={pi}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  title={`pod ${p}`}
                  className={cn(
                    'h-4 w-4 rounded-[3px] transition-colors duration-500',
                    podTone[p],
                    p === 'pending' && 'animate-pulse',
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* hpa */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Cpu className="h-3 w-3" /> hpa target 60%
          </span>
          <span className="text-foreground">{cpu}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${cpu}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Boxes className="h-3 w-3" /> {replicas} replicas
          </span>
          <span className="flex items-center gap-1.5">
            <Ship className="h-3 w-3" /> {ready} ready
          </span>
          <span className="flex items-center gap-1.5">
            <Network className="h-3 w-3" /> svc/api
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClusterTopology;