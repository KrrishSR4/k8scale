import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Hexagon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const schema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
  displayName: z.string().trim().max(60).optional(),
});

const Auth = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(params.get('mode') === 'signup' ? 'signup' : 'signin');
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  useEffect(() => {
    document.title = mode === 'signup' ? 'Create account — AutoScaleX' : 'Sign in — AutoScaleX';
  }, [mode]);

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const f: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) if (v?.[0]) f[k] = v[0];
      setErrors(f);
      return;
    }
    setErrors({});
    setBusy(true);

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { display_name: parsed.data.displayName || parsed.data.email.split('@')[0] },
        },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      if (!data.session) return setCheckEmail(true);
      toast.success('Account created');
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success('Welcome back');
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: window.location.origin });
    if (result.error) {
      setBusy(false);
      toast.error('Google sign-in failed. Try again.');
      return;
    }
    if (result.redirected) return;
    setBusy(false);
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="grain relative hidden flex-col justify-between border-r border-border p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" />
        <div className="pointer-events-none absolute -left-24 bottom-10 h-96 w-96 rounded-full bg-primary/10 blur-[130px]" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Hexagon className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="font-display text-base">AutoScaleX</span>
        </Link>
        <div className="relative max-w-md">
          <h2 className="font-display text-4xl uppercase text-balance">
            Your cluster, <span className="text-primary">on autopilot.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sign in to manage applications, trigger rollouts and watch live telemetry from your
            Kubernetes workloads.
          </p>
        </div>
        <p className="relative font-mono text-xs text-muted-foreground">k8s v1.31 · SOC2 in progress</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-5 py-16 sm:px-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Hexagon className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="font-display text-base">AutoScaleX</span>
          </Link>

          {checkEmail ? (
            <div className="surface p-8 text-center">
              <h1 className="font-display text-xl uppercase">Check your email</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                We sent a confirmation link to {form.email}. Click it to activate your console access.
              </p>
              <Button variant="outline" className="mt-6 w-full" onClick={() => setCheckEmail(false)}>
                Back to sign in
              </Button>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl uppercase">
                {mode === 'signup' ? 'Create account' : 'Sign in'}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {mode === 'signup' ? 'Free while AutoScaleX is in beta.' : 'Welcome back to the console.'}
              </p>

              <Button variant="outline" className="mt-7 w-full" onClick={google} disabled={busy} type="button">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
                  <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51Z" />
                </svg>
                Continue with Google
              </Button>

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">or</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={submit} className="space-y-4" noValidate>
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="name" className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      Display name
                    </label>
                    <Input
                      id="name"
                      value={form.displayName}
                      onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                      placeholder="Ada Lovelace"
                      maxLength={60}
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                  />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                  />
                  {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === 'signup' ? 'Create account' : 'Sign in'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {mode === 'signup' ? 'Already have an account?' : 'No account yet?'}{' '}
                <button
                  type="button"
                  className="link-underline text-primary"
                  onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                >
                  {mode === 'signup' ? 'Sign in' : 'Create one'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
