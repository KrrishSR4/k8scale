import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KubeWheel from '@/components/brand/KubeWheel';
import ClusterTopology from '@/components/landing/ClusterTopology';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative grid min-h-screen grid-cols-1 overflow-hidden pt-16 lg:grid-cols-[1.05fr_1fr]">
      {/* Left: message */}
      <div className="grain relative flex items-center border-b border-border px-5 py-16 sm:px-8 lg:border-b-0 lg:border-r lg:px-14 lg:py-0">
        <div className="pointer-events-none absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-[360px] w-[360px] text-foreground/[0.04]">
          <KubeWheel strokeWidth={2} />
        </div>
        <div className="relative z-10 max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow"
          >
            <KubeWheel className="h-3.5 w-3.5 text-primary" strokeWidth={6} detailed={false} />
            Kubernetes 1.31 · GitOps native
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="mt-6 font-display text-[clamp(2.6rem,6.2vw,4.6rem)] uppercase text-balance"
          >
            Ship to <span className="text-primary">Kubernetes</span> without touching YAML.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground"
          >
            AutoScaleX generates your manifests, runs the rollout, watches the pods, and scales
            replicas against live CPU pressure. You push code — the cluster handles itself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              className="group shadow-[0_10px_40px_-12px_hsl(var(--primary)/0.6)]"
              onClick={() => navigate(user ? '/dashboard' : '/auth?mode=signup')}
            >
              {user ? 'Open console' : 'Deploy your first app'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#connect">
                <Terminal className="h-4 w-4" />
                Connect a cluster
              </a>
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8"
          >
            {[
              { v: '99.99%', l: 'Control-plane SLA' },
              { v: '18s', l: 'Median rollout' },
              { v: '11k', l: 'Deploys / day' },
            ].map((s) => (
              <div key={s.l}>
                <dt className="font-display text-2xl text-primary">{s.v}</dt>
                <dd className="mt-1 text-xs leading-snug text-muted-foreground">{s.l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>

      {/* Right: live terminal */}
      <div className="grid-lines relative flex items-center justify-center px-5 py-16 sm:px-8 lg:px-12 lg:py-0">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_35%,hsl(var(--primary)/0.10),transparent)]" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative w-full max-w-lg [perspective:1400px]"
        >
          <div ref={panelRef} className="surface overflow-hidden shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                autoscalex — zsh
              </span>
            </div>
            <div className="min-h-[268px] space-y-1.5 p-5 font-mono text-[13px] leading-relaxed">
              {SCRIPT.slice(0, lines).map((l, i) => (
                <motion.div
                  key={`${lines}-${i}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={toneClass[l.tone]}
                >
                  {l.text}
                </motion.div>
              ))}
              <span className="inline-block h-4 w-2 animate-blink bg-primary align-middle" />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { k: 'pods', v: '4/4' },
              { k: 'cpu', v: '41%' },
              { k: 'p95', v: '84ms' },
            ].map((m) => (
              <div key={m.k} className="surface surface-hover px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{m.k}</p>
                <p className="mt-1 font-display text-lg">{m.v}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
