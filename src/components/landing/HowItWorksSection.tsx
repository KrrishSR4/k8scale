const steps = [
  {
    n: '01',
    title: 'Connect your cluster',
    body: 'Point AutoScaleX at any conformant Kubernetes cluster — EKS, GKE, AKS, k3s or a local kind node.',
    code: 'autoscalex cluster add --kubeconfig ~/.kube/config',
  },
  {
    n: '02',
    title: 'Describe the service',
    body: 'Image, port, region, resource limits and autoscaling bounds. That is the whole configuration surface.',
    code: 'autoscalex app create api-gateway --image ghcr.io/acme/api:1.4',
  },
  {
    n: '03',
    title: 'Deploy',
    body: 'We render the manifests, apply them, watch the rollout and stream the build log into your console.',
    code: 'autoscalex deploy --app api-gateway --wait',
  },
  {
    n: '04',
    title: 'Let it scale',
    body: 'The HPA takes over. Traffic spikes add pods, quiet hours remove them, and you get alerted either way.',
    code: 'kubectl get hpa api-gateway -w',
  },
];

const HowItWorksSection = () => (
  <section id="pipeline" className="relative border-t border-border">
    <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="order-2 divide-y divide-border lg:order-1">
        {steps.map((s) => (
          <div key={s.n} data-reveal className="group px-5 py-10 transition-colors hover:bg-card sm:px-8 lg:px-14">
            <div className="flex items-baseline gap-5">
              <span className="font-mono text-xs text-primary">{s.n}</span>
              <div className="flex-1">
                <h3 className="font-display text-xl uppercase">{s.title}</h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                <pre className="mt-4 overflow-x-auto rounded-md border border-border bg-background/70 px-4 py-3 font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                  <code>{s.code}</code>
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="order-1 border-b border-border px-5 py-16 sm:px-8 lg:order-2 lg:sticky lg:top-16 lg:h-fit lg:border-b-0 lg:border-l lg:px-12 lg:py-24">
        <div data-reveal>
          <p className="eyebrow">02 — Pipeline</p>
          <h2 className="mt-5 font-display text-[clamp(2rem,3.4vw,2.75rem)] uppercase text-balance">
            Four steps from container to cluster.
          </h2>
          <p className="mt-5 text-sm text-muted-foreground">
            No Helm charts to maintain. No operator to babysit. The CLI and the console do the same
            things, so scripts and humans stay in sync.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
