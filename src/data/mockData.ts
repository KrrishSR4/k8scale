// Mock data for AutoScaleX dashboard

export interface Application {
  id: string;
  name: string;
  repo: string;
  environment: 'production' | 'staging';
  status: 'running' | 'failed' | 'deploying';
  lastDeployed: string;
  pods: number;
}

export interface Deployment {
  id: string;
  appName: string;
  version: string;
  type: 'canary' | 'full';
  status: 'success' | 'failed' | 'in-progress';
  timestamp: string;
  duration: string;
}

export interface MetricPoint {
  time: string;
  value: number;
}

export interface OverviewStats {
  totalApps: number;
  activeDeployments: number;
  runningPods: number;
  cpuUsage: number;
  memoryUsage: number;
}

export const mockApplications: Application[] = [
  {
    id: '1',
    name: 'api-gateway',
    repo: 'autoscalex/api-gateway',
    environment: 'production',
    status: 'running',
    lastDeployed: '2026-01-22T10:30:00Z',
    pods: 4,
  },
  {
    id: '2',
    name: 'user-service',
    repo: 'autoscalex/user-service',
    environment: 'production',
    status: 'running',
    lastDeployed: '2026-01-21T15:45:00Z',
    pods: 3,
  },
  {
    id: '3',
    name: 'payment-processor',
    repo: 'autoscalex/payments',
    environment: 'staging',
    status: 'deploying',
    lastDeployed: '2026-01-22T09:15:00Z',
    pods: 2,
  },
  {
    id: '4',
    name: 'notification-hub',
    repo: 'autoscalex/notifications',
    environment: 'production',
    status: 'failed',
    lastDeployed: '2026-01-20T18:00:00Z',
    pods: 0,
  },
  {
    id: '5',
    name: 'analytics-engine',
    repo: 'autoscalex/analytics',
    environment: 'staging',
    status: 'running',
    lastDeployed: '2026-01-22T08:00:00Z',
    pods: 5,
  },
];

export const mockDeployments: Deployment[] = [
  {
    id: 'd1',
    appName: 'api-gateway',
    version: 'v2.4.1',
    type: 'full',
    status: 'success',
    timestamp: '2026-01-22T10:30:00Z',
    duration: '2m 34s',
  },
  {
    id: 'd2',
    appName: 'user-service',
    version: 'v1.8.0',
    type: 'canary',
    status: 'success',
    timestamp: '2026-01-21T15:45:00Z',
    duration: '3m 12s',
  },
  {
    id: 'd3',
    appName: 'payment-processor',
    version: 'v3.0.0-beta',
    type: 'canary',
    status: 'in-progress',
    timestamp: '2026-01-22T09:15:00Z',
    duration: '—',
  },
  {
    id: 'd4',
    appName: 'notification-hub',
    version: 'v1.2.3',
    type: 'full',
    status: 'failed',
    timestamp: '2026-01-20T18:00:00Z',
    duration: '1m 45s',
  },
  {
    id: 'd5',
    appName: 'analytics-engine',
    version: 'v4.1.0',
    type: 'full',
    status: 'success',
    timestamp: '2026-01-22T08:00:00Z',
    duration: '4m 22s',
  },
];

export const mockOverviewStats: OverviewStats = {
  totalApps: 5,
  activeDeployments: 3,
  runningPods: 14,
  cpuUsage: 67,
  memoryUsage: 54,
};

export const mockCpuMetrics: MetricPoint[] = [
  { time: '00:00', value: 45 },
  { time: '04:00', value: 32 },
  { time: '08:00', value: 58 },
  { time: '12:00', value: 72 },
  { time: '16:00', value: 85 },
  { time: '20:00', value: 67 },
  { time: '24:00', value: 55 },
];

export const mockMemoryMetrics: MetricPoint[] = [
  { time: '00:00', value: 40 },
  { time: '04:00', value: 38 },
  { time: '08:00', value: 52 },
  { time: '12:00', value: 61 },
  { time: '16:00', value: 58 },
  { time: '20:00', value: 54 },
  { time: '24:00', value: 48 },
];

export const mockRequestMetrics: MetricPoint[] = [
  { time: '00:00', value: 1200 },
  { time: '04:00', value: 800 },
  { time: '08:00', value: 3500 },
  { time: '12:00', value: 5200 },
  { time: '16:00', value: 4800 },
  { time: '20:00', value: 3200 },
  { time: '24:00', value: 1800 },
];

export const techStack = [
  { name: 'Next.js', icon: 'nextjs' },
  { name: 'Node.js', icon: 'nodejs' },
  { name: 'Go', icon: 'go' },
  { name: 'Kubernetes', icon: 'kubernetes' },
  { name: 'Docker', icon: 'docker' },
  { name: 'AWS', icon: 'aws' },
  { name: 'Prometheus', icon: 'prometheus' },
  { name: 'Grafana', icon: 'grafana' },
];

export const features = [
  {
    title: 'GitHub-based deployments',
    description: 'Connect your repository and deploy with every push. Seamless integration with your workflow.',
    icon: 'github',
  },
  {
    title: 'Zero-downtime releases',
    description: 'Rolling updates ensure your users never experience interruptions during deployments.',
    icon: 'zap',
  },
  {
    title: 'Automatic scaling',
    description: 'Scale your services based on real-time metrics. Handle traffic spikes effortlessly.',
    icon: 'trending-up',
  },
  {
    title: 'Canary deployments',
    description: 'Test new versions with a subset of users before full rollout. Reduce risk.',
    icon: 'shield',
  },
  {
    title: 'Instant rollback',
    description: 'One-click rollback to any previous version. Recover from issues in seconds.',
    icon: 'rotate-ccw',
  },
  {
    title: 'Built-in monitoring',
    description: 'Real-time metrics, logs, and alerts. Know exactly what is happening in your cluster.',
    icon: 'activity',
  },
];

export const howItWorks = [
  {
    step: 1,
    title: 'Connect GitHub repository',
    description: 'Link your repository with one click. We support all major Git providers.',
  },
  {
    step: 2,
    title: 'Push code',
    description: 'Push to your main branch or create a pull request. AutoScaleX detects changes instantly.',
  },
  {
    step: 3,
    title: 'AutoScaleX builds & deploys',
    description: 'We build your container, run tests, and deploy to Kubernetes automatically.',
  },
  {
    step: 4,
    title: 'Monitor and scale automatically',
    description: 'Track performance metrics and let AutoScaleX handle scaling based on demand.',
  },
];
