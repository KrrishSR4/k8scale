import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { REGIONS, type Application } from '@/lib/types';
import { slugify } from '@/lib/k8s';
import { useCreateApplication, useUpdateApplication } from '@/hooks/useApplications';

const schema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
  description: z.string().trim().max(280).optional(),
  image: z.string().trim().min(3, 'Container image is required').max(200),
  region: z.string().min(1),
  namespace: z.string().trim().min(1).max(60),
  port: z.number().int().min(1).max(65535),
  min_replicas: z.number().int().min(1).max(50),
  max_replicas: z.number().int().min(1).max(200),
  cpu_limit: z.string().trim().min(1).max(20),
  memory_limit: z.string().trim().min(1).max(20),
});

const empty = {
  name: '',
  description: '',
  image: 'ghcr.io/acme/api:latest',
  region: 'us-east-1',
  namespace: 'default',
  port: 8080,
  min_replicas: 2,
  max_replicas: 10,
  cpu_limit: '500m',
  memory_limit: '512Mi',
};

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  application?: Application | null;
}

const Field = ({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) => (
  <div>
    <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
    {children}
    {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
  </div>
);

const ApplicationDialog = ({ open, onOpenChange, application }: Props) => {
  const [form, setForm] = useState({ ...empty });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const create = useCreateApplication();
  const update = useUpdateApplication();
  const busy = create.isPending || update.isPending;

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      application
        ? {
            name: application.name,
            description: application.description ?? '',
            image: application.image,
            region: application.region,
            namespace: application.namespace,
            port: application.port,
            min_replicas: application.min_replicas,
            max_replicas: application.max_replicas,
            cpu_limit: application.cpu_limit,
            memory_limit: application.memory_limit,
          }
        : { ...empty },
    );
  }, [open, application]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const f: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) if (v?.[0]) f[k] = v[0];
      setErrors(f);
      return;
    }
    if (parsed.data.max_replicas < parsed.data.min_replicas) {
      setErrors({ max_replicas: 'Max must be greater than min' });
      return;
    }
    const payload = {
      ...parsed.data,
      description: parsed.data.description || null,
      slug: slugify(parsed.data.name),
      replicas: parsed.data.min_replicas,
    };
    if (application) await update.mutateAsync({ id: application.id, ...payload });
    else await create.mutateAsync(payload);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display uppercase">
            {application ? 'Edit application' : 'New application'}
          </DialogTitle>
          <DialogDescription>
            These values generate the Deployment, Service and HPA manifests applied to your cluster.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Field label="Name" error={errors.name}>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="API Gateway" />
          </Field>
          <Field label="Description" error={errors.description}>
            <Textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Edge routing and rate limiting"
            />
          </Field>
          <Field label="Container image" error={errors.image}>
            <Input className="font-mono text-xs" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Region">
              <Select value={form.region} onValueChange={(v) => setForm({ ...form, region: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Namespace" error={errors.namespace}>
              <Input value={form.namespace} onChange={(e) => setForm({ ...form, namespace: e.target.value })} />
            </Field>
            <Field label="Port" error={errors.port}>
              <Input type="number" value={form.port} onChange={(e) => setForm({ ...form, port: Number(e.target.value) })} />
            </Field>
            <Field label="CPU limit" error={errors.cpu_limit}>
              <Input value={form.cpu_limit} onChange={(e) => setForm({ ...form, cpu_limit: e.target.value })} />
            </Field>
            <Field label="Min replicas" error={errors.min_replicas}>
              <Input type="number" value={form.min_replicas} onChange={(e) => setForm({ ...form, min_replicas: Number(e.target.value) })} />
            </Field>
            <Field label="Max replicas" error={errors.max_replicas}>
              <Input type="number" value={form.max_replicas} onChange={(e) => setForm({ ...form, max_replicas: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Memory limit" error={errors.memory_limit}>
            <Input value={form.memory_limit} onChange={(e) => setForm({ ...form, memory_limit: e.target.value })} />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {application ? 'Save changes' : 'Create application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDialog;
