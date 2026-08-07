import { Activity, GitBranch, Layers3, Lock, Scaling, Undo2 } from 'lucide-react';

const features = [
  {
    icon: Scaling,
    title: 'Autoscaling that reacts',
    body: 'HPA policies generated per service. Replicas track real CPU pressure between your min and max bounds, not a fixed guess.',
  },
  {
    icon: GitBranch,
    title: 'GitOps pipelines',
    body: 'Push to main, get a rollout. Every deploy is recorded with version, commit, duration and full build log.',
  },
  {
    icon: Activity,
    title: 'Telemetry in the console',
    body: 'CPU, memory, throughput and p95 latency streamed live per application — no separate observability stack to wire up.',
  },
  {
    icon: Undo2,
    title: 'One-click rollback',
    body: 'Every revision is retained. Roll a bad release back to the previous healthy image in a single action.',
  },
  {
    icon: Layers3,
    title: 'Manifests you can read',
    body: 'We generate Deployment, Service and HPA YAML you can copy, review, commit and kubectl apply yourself.',
  },
  {
    icon: Lock,
    title: 'Isolated by default',
    body: 'Per-account namespaces, scoped credentials, and row-level isolation so one tenant can never read another.',
  },
];

const FeaturesSection = () => (
  <section id="platform" className="relative border-t border-border">
    <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="border-b border-border px-5 py-16 sm:px-8 lg:sticky lg:top-16 lg:h-fit lg:border-b-0 lg:border-r lg:px-14 lg:py-24">
        <div data-reveal>
          <p className="eyebrow">01 — Platform</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,3.6vw,3rem)] uppercase text-balance">
            Everything a platform team builds, already built.
          </h2>
          <p className="mt-5 max-w-sm text-muted-foreground">
            AutoScaleX replaces the six months of glue code between a container registry and a
            production cluster.
          </p>
        </div>
      </div>

      <div data-reveal="stagger" className="grid grid-cols-1 sm:grid-cols-2">
        {features.map((f) => (
          <article
            key={f.title}
            className="group relative border-b border-border p-8 transition-colors duration-300 hover:bg-card sm:odd:border-r lg:p-10"
          >
            <span className="absolute left-0 top-0 h-full w-px scale-y-0 bg-primary transition-transform duration-500 group-hover:scale-y-100" />
            <f.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:-translate-y-0.5" />
            <h3 className="mt-5 font-display text-lg uppercase">{f.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
