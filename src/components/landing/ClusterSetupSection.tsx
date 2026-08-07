import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  {
    id: 'local',
    label: 'Local (kind)',
    steps: [
      { c: 'brew install kind kubectl', d: 'Install the toolchain.' },
      { c: 'kind create cluster --name autoscalex', d: 'Spin up a single-node cluster.' },
      {
        c: 'kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml',
        d: 'Metrics Server is required for HPA to read CPU.',
      },
      { c: 'kubectl apply -f api-gateway.yaml', d: 'Apply the manifest generated in your console.' },
      { c: 'kubectl port-forward svc/api-gateway 8080:80', d: 'Reach the service at localhost:8080.' },
    ],
  },
  {
    id: 'eks',
    label: 'AWS EKS',
    steps: [
      { c: 'eksctl create cluster --name autoscalex --region us-east-1 --nodes 3', d: 'Provision the cluster.' },
      { c: 'aws eks update-kubeconfig --name autoscalex --region us-east-1', d: 'Write the kubeconfig context.' },
      { c: 'kubectl create namespace production', d: 'Namespace per environment.' },
      { c: 'kubectl apply -f api-gateway.yaml -n production', d: 'Apply Deployment, Service and HPA.' },
      { c: 'kubectl rollout status deployment/api-gateway -n production', d: 'Block until pods are ready.' },
    ],
  },
  {
    id: 'gke',
    label: 'Google GKE',
    steps: [
      { c: 'gcloud container clusters create-auto autoscalex --region us-central1', d: 'Autopilot cluster.' },
      { c: 'gcloud container clusters get-credentials autoscalex --region us-central1', d: 'Authenticate kubectl.' },
      { c: 'kubectl apply -f api-gateway.yaml', d: 'Apply the generated bundle.' },
      { c: 'kubectl get hpa -w', d: 'Watch the autoscaler react to load.' },
    ],
  },
];

const ClusterSetupSection = () => {
  const [active, setActive] = useState(tabs[0].id);
  const [copied, setCopied] = useState<string | null>(null);
  const current = tabs.find((t) => t.id === active)!;

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1600);
  };

  return (
    <section id="connect" className="relative border-t border-border">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="border-b border-border px-5 py-16 sm:px-8 lg:sticky lg:top-16 lg:h-fit lg:border-b-0 lg:border-r lg:px-14 lg:py-24">
          <div data-reveal>
            <p className="eyebrow">03 — Connect</p>
            <h2 className="mt-5 font-display text-[clamp(2rem,3.4vw,2.75rem)] uppercase text-balance">
              Real cluster. Real kubectl.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Manifests generated in the console are standard Kubernetes objects. Copy them into your
              repo and apply them with the commands below — nothing here is proprietary.
            </p>
          </div>
        </div>

        <div className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24" data-reveal>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Cluster provider">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={active === t.id}
                onClick={() => setActive(t.id)}
                className={cn(
                  'rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-300',
                  active === t.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <ol className="mt-8 space-y-3">
            {current.steps.map((s, i) => (
              <li
                key={s.c}
                className="surface surface-hover animate-reveal-up p-4 opacity-0"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <p className="text-sm text-muted-foreground">{s.d}</p>
                <div className="mt-2 flex items-start gap-3">
                  <code className="flex-1 overflow-x-auto whitespace-pre-wrap break-all font-mono text-xs text-primary">
                    {s.c}
                  </code>
                  <button
                    onClick={() => copy(s.c)}
                    aria-label="Copy command"
                    className="shrink-0 rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    {copied === s.c ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default ClusterSetupSection;
