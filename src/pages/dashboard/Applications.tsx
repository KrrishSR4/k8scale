import { useMemo, useState } from 'react';
import { Plus, Rocket, Pencil, Trash2, FileCode2, Search, Copy, Check } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatusBadge from '@/components/dashboard/StatusBadge';
import ApplicationDialog from '@/components/dashboard/ApplicationDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApplications, useDeleteApplication, useTriggerDeploy } from '@/hooks/useApplications';
import { buildCliCommands, buildManifest } from '@/lib/k8s';
import type { Application } from '@/lib/types';
import { toast } from 'sonner';

const Applications = () => {
  const { data: apps = [], isLoading } = useApplications();
  const del = useDeleteApplication();
  const deploy = useTriggerDeploy();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [manifestFor, setManifestFor] = useState<Application | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter((a) => `${a.name} ${a.image} ${a.region}`.toLowerCase().includes(q));
  }, [apps, query]);

  const copyManifest = async () => {
    if (!manifestFor) return;
    await navigator.clipboard.writeText(buildManifest(manifestFor));
    setCopied(true);
    toast.success('Manifest copied');
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <DashboardLayout
      title="Applications"
      subtitle="Workloads managed by AutoScaleX"
      actions={
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4" /> New app
        </Button>
      }
    >
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search applications…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
        </div>
      ) : filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((app) => (
            <article key={app.id} className="surface surface-hover flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-display text-base">{app.name}</h2>
                  <p className="truncate font-mono text-[11px] text-muted-foreground">{app.slug}.{app.region}.autoscalex.io</p>
                </div>
                <StatusBadge status={app.status} />
              </div>

              {app.description && <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{app.description}</p>}

              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-[11px]">
                <div><dt className="text-muted-foreground">image</dt><dd className="truncate">{app.image}</dd></div>
                <div><dt className="text-muted-foreground">namespace</dt><dd>{app.namespace}</dd></div>
                <div><dt className="text-muted-foreground">replicas</dt><dd>{app.min_replicas}–{app.max_replicas}</dd></div>
                <div><dt className="text-muted-foreground">limits</dt><dd>{app.cpu_limit} / {app.memory_limit}</dd></div>
              </dl>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
                <Button
                  size="sm"
                  disabled={deploy.isPending || app.status === 'deploying'}
                  onClick={() => deploy.mutate({ app })}
                >
                  <Rocket className="h-4 w-4" />
                  {app.status === 'deploying' ? 'Deploying…' : 'Deploy'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setManifestFor(app)}>
                  <FileCode2 className="h-4 w-4" /> YAML
                </Button>
                <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => { setEditing(app); setDialogOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Delete" className="text-muted-foreground hover:text-destructive" onClick={() => setDeleteTarget(app)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="surface flex flex-col items-center justify-center gap-3 p-14 text-center">
          <p className="font-display text-lg uppercase">No applications</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Create your first workload — AutoScaleX generates the manifests and handles the rollout.
          </p>
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus className="h-4 w-4" /> New application</Button>
        </div>
      )}

      <ApplicationDialog open={dialogOpen} onOpenChange={setDialogOpen} application={editing} />

      <Dialog open={!!manifestFor} onOpenChange={(v) => !v && setManifestFor(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display uppercase">{manifestFor?.name} manifests</DialogTitle>
          </DialogHeader>
          {manifestFor && (
            <>
              <div className="flex justify-end">
                <Button size="sm" variant="outline" onClick={copyManifest}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy YAML
                </Button>
              </div>
              <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-[11px] leading-relaxed">
                {buildManifest(manifestFor)}
              </pre>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Apply from your terminal</p>
              <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-[11px] leading-relaxed">
                {buildCliCommands(manifestFor).join('\n')}
              </pre>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the application and its deployment history. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => { if (deleteTarget) del.mutate(deleteTarget.id); setDeleteTarget(null); }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Applications;
