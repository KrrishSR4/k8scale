import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { ArrowRight, Terminal, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandLogo from '@/components/brand/BrandLogo';
import KubeMark from '@/components/brand/KubeMark';
import ClusterTopology from '@/components/landing/ClusterTopology';
import { useAuth } from '@/contexts/AuthContext';

const EASE = [0.16, 1, 0.3, 1] as const;

const HEADLINE = ['Ship', 'to', 'Kubernetes', 'without', 'touching', 'YAML.'];

const TICKER = [
  'apps/v1 · Deployment',
  'autoscaling/v2 · HorizontalPodAutoscaler',
  'v1 · Service',
  'networking.k8s.io/v1 · Ingress',
  'v1 · ConfigMap',
  'policy/v1 · PodDisruptionBudget',
  'batch/v1 · CronJob',
  'v1 · ServiceAccount · RBAC',
];

/** Counts a number up once, on mount. */
const Counter = ({ to, suffix = '', decimals = 0 }: { to: number; suffix?: string; decimals?: number }) => {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => v.toFixed(decimals));
  useEffect(() => {
    const c = animate(mv, to, { duration: 1.6, delay: 0.5, ease: 'easeOut' });
    return () => c.stop();
  }, [mv, to]);
  return (
    <span className="tabular-nums">
      <motion.span>{text}</motion.span>
      {suffix}
    </span>
  );
};

/** Button wrapper that leans toward the cursor. */
const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className="inline-flex"
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const stageRef = useRef<HTMLElement>(null);
  const [pods, setPods] = useState(12);

  // Cursor spotlight on the left panel.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  // Live-feeling replica counter in the status strip.
  useEffect(() => {
    const id = setInterval(() => setPods((p) => Math.max(8, Math.min(24, p + (Math.random() > 0.5 ? 1 : -1)))), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={stageRef}
      className="spotlight relative grid min-h-screen grid-cols-1 overflow-hidden pt-16 lg:grid-cols-[1.05fr_1fr]"
    >
      {/* Left: message */}
      <div className="grain relative flex items-center border-b border-border px-5 py-20 sm:px-8 lg:border-b-0 lg:border-r lg:px-14 lg:py-0">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.35]" />
        <div className="pointer-events-none absolute -left-40 top-1/4 h-[460px] w-[460px] rounded-full bg-primary/10 blur-[130px]" />
        <KubeMark className="-bottom-28 -left-28 h-[420px] w-[420px] animate-spin-slow" opacity={0.14} />

        <div className="relative z-10 max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow rounded-full border border-border bg-card/60 px-3 py-1.5 backdrop-blur"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Kubernetes 1.31 · GitOps native
          </motion.p>

          <h1 className="mt-6 font-display text-[clamp(2.7rem,6.4vw,5rem)] uppercase leading-[0.95] text-balance">
            {HEADLINE.map((w, i) => (
              <span key={w + i} className="mr-[0.28em] inline-block overflow-hidden align-bottom">
                <motion.span
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease: EASE }}
                  className={
                    w === 'Kubernetes'
                      ? 'inline-block bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent'
                      : 'inline-block'
                  }
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground"
          >
            AutoScaleX generates your manifests, runs the rollout, watches the pods, and scales
            replicas against live CPU pressure. You push code — the cluster handles itself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <Button
                size="lg"
                className="group relative overflow-hidden shadow-[0_10px_40px_-12px_hsl(var(--primary)/0.6)]"
                onClick={() => navigate(user ? '/dashboard' : '/auth?mode=signup')}
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-foreground/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                {user ? 'Open console' : 'Deploy your first app'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Magnetic>
            <Button size="lg" variant="outline" asChild className="group">
              <a href="#connect">
                <Terminal className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                Connect a cluster
              </a>
            </Button>
          </motion.div>

          {/* Live status strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-8 inline-flex items-center gap-3 rounded-lg border border-border bg-card/50 px-3.5 py-2 font-mono text-[11px] text-muted-foreground backdrop-blur"
          >
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span>
              reconciling · <span className="text-foreground">{pods}</span> pods desired
            </span>
            <span className="h-3 w-px bg-border" />
            <span className="text-foreground">healthy</span>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8"
          >
            {[
              { v: <Counter to={99.99} suffix="%" decimals={2} />, l: 'Control-plane SLA' },
              { v: <Counter to={18} suffix="s" />, l: 'Median rollout' },
              { v: <Counter to={11} suffix="k" />, l: 'Deploys / day' },
            ].map((s) => (
              <div key={s.l} className="group cursor-default">
                <dt className="font-display text-2xl text-primary transition-transform duration-300 group-hover:-translate-y-0.5">
                  {s.v}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-muted-foreground">{s.l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>

      {/* Right: live cluster topology */}
      <div className="grid-lines relative flex items-center justify-center px-5 py-16 sm:px-8 lg:px-12 lg:py-0">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_35%,hsl(var(--primary)/0.10),transparent)]" />
        <KubeMark className="left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2" opacity={0.09} />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          className="relative w-full max-w-lg [perspective:1400px]"
        >
          <ClusterTopology />

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { k: 'namespaces', v: '12' },
              { k: 'nodes', v: '3' },
              { k: 'p95', v: '84ms' },
            ].map((m, i) => (
              <motion.div
                key={m.k}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.08, ease: EASE }}
                whileHover={{ y: -3 }}
                className="surface surface-hover px-4 py-3"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{m.k}</p>
                <p className="mt-1 font-display text-lg">{m.v}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom API ticker */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden border-t border-border bg-background/70 backdrop-blur lg:block">
        <div className="flex overflow-hidden py-2.5">
          <div className="animate-marquee flex shrink-0 items-center gap-8 pr-8 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} className="flex items-center gap-2 whitespace-nowrap">
                <span className="inline-flex h-3 w-3 opacity-70">
                  <BrandLogo spinOnHover={false} />
                </span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
