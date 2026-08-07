import type { Application } from './types';

/** Renders a real, apply-ready Kubernetes manifest bundle for an application. */
export const buildManifest = (app: Application): string => {
  const env = Object.entries(app.env_vars ?? {});
  const envBlock = env.length
    ? `\n          env:\n${env
        .map(([k, v]) => `            - name: ${k}\n              value: "${String(v).replace(/"/g, '\\"')}"`)
        .join('\n')}`
    : '';

  return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${app.slug}
  namespace: ${app.namespace}
  labels:
    app.kubernetes.io/name: ${app.slug}
    app.kubernetes.io/managed-by: autoscalex
spec:
  replicas: ${app.replicas}
  selector:
    matchLabels:
      app: ${app.slug}
  template:
    metadata:
      labels:
        app: ${app.slug}
    spec:
      containers:
        - name: ${app.slug}
          image: ${app.image}
          ports:
            - containerPort: ${app.port}
          resources:
            requests:
              cpu: ${app.cpu_limit}
              memory: ${app.memory_limit}
            limits:
              cpu: ${app.cpu_limit}
              memory: ${app.memory_limit}
          readinessProbe:
            httpGet:
              path: /healthz
              port: ${app.port}
            initialDelaySeconds: 5
            periodSeconds: 10${envBlock}
---
apiVersion: v1
kind: Service
metadata:
  name: ${app.slug}
  namespace: ${app.namespace}
spec:
  selector:
    app: ${app.slug}
  ports:
    - port: 80
      targetPort: ${app.port}
  type: ClusterIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${app.slug}
  namespace: ${app.namespace}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${app.slug}
  minReplicas: ${app.min_replicas}
  maxReplicas: ${app.max_replicas}
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
`;
};

export const buildCliCommands = (app: Application): string[] => [
  `kubectl create namespace ${app.namespace} --dry-run=client -o yaml | kubectl apply -f -`,
  `kubectl apply -f ${app.slug}.yaml`,
  `kubectl rollout status deployment/${app.slug} -n ${app.namespace}`,
  `kubectl port-forward svc/${app.slug} 8080:80 -n ${app.namespace}`,
];

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
