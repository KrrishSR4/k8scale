export type AppStatus = 'running' | 'deploying' | 'failed' | 'paused';
export type DeployStatus = 'success' | 'deploying' | 'failed';

export interface Application {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string;
  region: string;
  namespace: string;
  replicas: number;
  min_replicas: number;
  max_replicas: number;
  cpu_limit: string;
  memory_limit: string;
  port: number;
  env_vars: Record<string, string>;
  status: AppStatus;
  created_at: string;
  updated_at: string;
}

export interface Deployment {
  id: string;
  user_id: string;
  application_id: string;
  version: string;
  commit_message: string | null;
  triggered_by: string;
  status: DeployStatus;
  duration_seconds: number | null;
  logs: string[];
  created_at: string;
  updated_at: string;
}

export const REGIONS = [
  'us-east-1',
  'us-west-2',
  'eu-west-1',
  'eu-central-1',
  'ap-south-1',
  'ap-southeast-1',
] as const;
