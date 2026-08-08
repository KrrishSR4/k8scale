import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AuditCategory = 'deployment' | 'application' | 'account' | 'system';

export interface AuditEntry {
  id: string;
  user_id: string;
  action: string;
  category: AuditCategory;
  target: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AuditInput {
  action: string;
  category: AuditCategory;
  target?: string | null;
  target_id?: string | null;
  metadata?: Record<string, unknown>;
}

/** Fire-and-forget audit writer usable outside React components. */
export const recordAudit = async (userId: string | undefined, entry: AuditInput) => {
  if (!userId) return;
  await supabase.from('audit_logs').insert({
    user_id: userId,
    action: entry.action,
    category: entry.category,
    target: entry.target ?? null,
    target_id: entry.target_id ?? null,
    metadata: entry.metadata ?? {},
  } as never);
};

export const useRecordAudit = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entry: AuditInput) => recordAudit(user?.id, entry),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['audit_logs'] }),
  });
};

export const useAuditLog = (category?: AuditCategory | 'all', search = '') => {
  const { user } = useAuth();
  const qc = useQueryClient();

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('audit-logs-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'audit_logs', filter: `user_id=eq.${user.id}` },
        () => qc.invalidateQueries({ queryKey: ['audit_logs'] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, qc]);

  return useQuery({
    queryKey: ['audit_logs', user?.id, category ?? 'all', search],
    enabled: !!user,
    queryFn: async () => {
      let q = supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(200);
      if (category && category !== 'all') q = q.eq('category', category);
      if (search.trim()) q = q.ilike('action', `%${search.trim()}%`);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as AuditEntry[];
    },
  });
};