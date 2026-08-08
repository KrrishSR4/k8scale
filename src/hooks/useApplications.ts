import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Application, Deployment } from '@/lib/types';
import { toast } from 'sonner';
import { recordAudit } from '@/hooks/useAuditLog';

const DEPLOY_STEPS = [
  'Resolving container image',
  'Building layers',
  'Running test suite',
  'Pushing to registry',
  'Applying manifests',
  'Waiting for rollout',
  'Health checks passed',
];

export const useApplications = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['applications', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Application[];
    },
  });
};

export const useDeployments = (applicationId?: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['deployments', user?.id, applicationId ?? 'all'],
    enabled: !!user,
    queryFn: async () => {
      let q = supabase.from('deployments').select('*').order('created_at', { ascending: false }).limit(100);
      if (applicationId) q = q.eq('application_id', applicationId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as Deployment[];
    },
  });
};

export const useCreateApplication = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (input: Partial<Application>) => {
      if (!user) throw new Error('Not signed in');
      const { data, error } = await supabase
        .from('applications')
        .insert({ ...input, user_id: user.id } as never)
        .select()
        .single();
      if (error) throw error;
      const app = data as unknown as Application;
      await recordAudit(user.id, {
        action: `Created application "${app.name}"`,
        category: 'application',
        target: app.slug,
        target_id: app.id,
        metadata: { image: app.image, region: app.region, replicas: app.replicas },
      });
      return app;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      qc.invalidateQueries({ queryKey: ['audit_logs'] });
      toast.success('Application created');
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useUpdateApplication = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Application> & { id: string }) => {
      const { error } = await supabase.from('applications').update(patch as never).eq('id', id);
      if (error) throw error;
      const fields = Object.keys(patch).filter((k) => k !== 'user_id');
      await recordAudit(user?.id, {
        action: `Updated configuration for "${patch.name ?? 'application'}"`,
        category: 'application',
        target: patch.slug ?? null,
        target_id: id,
        metadata: { changed: fields.join(', ') },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      qc.invalidateQueries({ queryKey: ['audit_logs'] });
      toast.success('Application updated');
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

export const useDeleteApplication = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('applications').delete().eq('id', id);
      if (error) throw error;
      await recordAudit(user?.id, {
        action: 'Deleted application',
        category: 'application',
        target_id: id,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      qc.invalidateQueries({ queryKey: ['deployments'] });
      qc.invalidateQueries({ queryKey: ['audit_logs'] });
      toast.success('Application deleted');
    },
    onError: (e: Error) => toast.error(e.message),
  });
};

/** Creates a deployment record, then walks it through a realistic rollout. */
export const useTriggerDeploy = () => {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ app, message }: { app: Application; message?: string }) => {
      if (!user) throw new Error('Not signed in');
      const version = `v1.${Math.floor(Date.now() / 1000) % 900}.${Math.floor(Math.random() * 9)}`;

      const { data, error } = await supabase
        .from('deployments')
        .insert({
          user_id: user.id,
          application_id: app.id,
          version,
          commit_message: message?.trim() || 'Manual deploy from dashboard',
          triggered_by: 'dashboard',
          status: 'deploying',
          logs: [`$ autoscalex deploy --app ${app.slug}`],
        } as never)
        .select()
        .single();
      if (error) throw error;

      await supabase.from('applications').update({ status: 'deploying' } as never).eq('id', app.id);
      await recordAudit(user.id, {
        action: `Deployment ${version} started for "${app.name}"`,
        category: 'deployment',
        target: app.slug,
        target_id: app.id,
        metadata: { version, triggered_by: 'dashboard' },
      });
      qc.invalidateQueries({ queryKey: ['applications'] });
      qc.invalidateQueries({ queryKey: ['deployments'] });

      const deployment = data as unknown as Deployment;
      const logs = [`$ autoscalex deploy --app ${app.slug}`];
      const started = Date.now();

      for (const step of DEPLOY_STEPS) {
        await new Promise((r) => setTimeout(r, 550 + Math.random() * 500));
        logs.push(`✓ ${step}`);
        await supabase.from('deployments').update({ logs } as never).eq('id', deployment.id);
        qc.invalidateQueries({ queryKey: ['deployments'] });
      }

      const duration = Math.round((Date.now() - started) / 1000);
      logs.push(`→ Live at https://${app.slug}.${app.region}.autoscalex.io`);

      await supabase
        .from('deployments')
        .update({ status: 'success', duration_seconds: duration, logs } as never)
        .eq('id', deployment.id);
      await supabase.from('applications').update({ status: 'running' } as never).eq('id', app.id);
      await recordAudit(user.id, {
        action: `Deployment ${version} succeeded for "${app.name}"`,
        category: 'deployment',
        target: app.slug,
        target_id: app.id,
        metadata: { version, duration: `${duration}s` },
      });

      return { ...deployment, status: 'success' as const };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['applications'] });
      qc.invalidateQueries({ queryKey: ['deployments'] });
      qc.invalidateQueries({ queryKey: ['audit_logs'] });
      toast.success('Deployment succeeded');
    },
    onError: (e: Error) => toast.error(e.message),
  });
};
