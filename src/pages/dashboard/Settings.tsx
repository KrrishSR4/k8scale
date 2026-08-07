import { useEffect, useState } from 'react';
import { Loader2, LogOut } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const nameSchema = z.string().trim().min(2, 'Too short').max(60, 'Too long');

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setDisplayName((data?.display_name as string) ?? '');
      });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = nameSchema.safeParse(displayName);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    setError('');
    setSaving(true);
    const { error: err } = await supabase
      .from('profiles')
      .update({ display_name: parsed.data } as never)
      .eq('id', user!.id);
    setSaving(false);
    if (err) return toast.error(err.message);
    toast.success('Profile updated');
  };

  return (
    <DashboardLayout title="Settings" subtitle="Account and workspace preferences">
      <div className="grid gap-4 lg:grid-cols-3">
        <form onSubmit={save} className="surface space-y-4 p-6 lg:col-span-2">
          <h2 className="font-display text-sm uppercase">Profile</h2>
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Display name</label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={60} />
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email</label>
            <Input value={user?.email ?? ''} readOnly disabled />
          </div>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
          </Button>
        </form>

        <div className="space-y-4">
          <section className="surface p-6">
            <h2 className="font-display text-sm uppercase">Cluster</h2>
            <dl className="mt-4 space-y-2 font-mono text-xs">
              <div className="flex justify-between"><dt className="text-muted-foreground">control plane</dt><dd>v1.31.2</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">plan</dt><dd>Beta</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">region</dt><dd>multi</dd></div>
            </dl>
          </section>
          <section className="surface p-6">
            <h2 className="font-display text-sm uppercase">Session</h2>
            <p className="mt-2 text-sm text-muted-foreground">Sign out of the AutoScaleX console on this device.</p>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={async () => { await signOut(); navigate('/'); }}
            >
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
