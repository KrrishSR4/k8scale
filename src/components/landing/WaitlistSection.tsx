import { useState } from 'react';
import { z } from 'zod';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import KubeMark from '@/components/brand/KubeMark';

const schema = z.object({
  name: z.string().trim().max(80, 'Name must be under 80 characters').optional(),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email').max(255),
  company: z.string().trim().max(120, 'Company must be under 120 characters').optional(),
});

const WaitlistSection = () => {
  const [form, setForm] = useState({ name: '', email: '', company: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) {
        if (v?.[0]) fieldErrors[k] = v[0];
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus('loading');

    const { error } = await supabase.from('waitlist').insert({
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.name || null,
      company: parsed.data.company || null,
    });

    if (error) {
      setStatus('idle');
      toast.error(
        error.code === '23505' ? 'That email is already on the list.' : 'Could not join right now. Try again.',
      );
      return;
    }
    setStatus('done');
    toast.success('You are on the list.');
  };

  return (
    <section id="waitlist" className="relative overflow-hidden border-t border-border">
      <KubeMark className="-right-32 -top-32 h-[520px] w-[520px]" opacity={0.05} />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-2">
        <div className="grain relative border-b border-border px-5 py-16 sm:px-8 lg:border-b-0 lg:border-r lg:px-14 lg:py-24">
          <div className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 rounded-full bg-primary/10 blur-[110px]" />
          <div data-reveal className="relative">
            <p className="eyebrow">04 — Access</p>
            <h2 className="mt-5 font-display text-[clamp(2rem,3.6vw,3rem)] uppercase text-balance">
              Get on the deploy list.
            </h2>
            <p className="mt-5 max-w-sm text-muted-foreground">
              Teams are onboarded in weekly batches. Join the list, or skip the queue and create a
              console account now — it is free while in beta.
            </p>
            <ul className="mt-8 space-y-2 text-sm text-muted-foreground">
              {['Unlimited apps in beta', 'Bring your own cluster', 'No credit card'].map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          {status === 'done' ? (
            <div className="surface w-full p-10 text-center">
              <CheckCircle2 className="mx-auto h-9 w-9 text-primary" />
              <h3 className="mt-4 font-display text-xl uppercase">You are in the queue</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We will email {form.email} when your batch opens.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="surface w-full space-y-4 p-8" noValidate data-reveal>
              <div>
                <label htmlFor="wl-name" className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Name
                </label>
                <Input
                  id="wl-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ada Lovelace"
                  maxLength={80}
                />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="wl-email" className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Work email *
                </label>
                <Input
                  id="wl-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ada@company.com"
                  maxLength={255}
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="wl-company" className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Company
                </label>
                <Input
                  id="wl-company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Acme Infrastructure"
                  maxLength={120}
                />
                {errors.company && <p className="mt-1 text-xs text-destructive">{errors.company}</p>}
              </div>
              <Button type="submit" className="group w-full" size="lg" disabled={status === 'loading'}>
                {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Request access'}
                {status !== 'loading' && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;
