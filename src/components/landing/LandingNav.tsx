import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandLogo from '@/components/brand/BrandLogo';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const links = [
  { label: 'Platform', href: '#platform' },
  { label: 'Pipeline', href: '#pipeline' },
  { label: 'Connect cluster', href: '#connect' },
  { label: 'Access', href: '#waitlist' },
];

const LandingNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled ? 'border-b border-border bg-background/80 backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 lg:px-10">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="AutoScaleX home">
          <span className="relative flex h-9 w-9 items-center justify-center">
            <span className="absolute inset-0 rounded-lg bg-primary/10 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
            <BrandLogo className="relative h-9 w-9" />
          </span>
          <span className="font-display text-base tracking-tight">AutoScaleX</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Button size="sm" onClick={() => navigate('/dashboard')}>
              Open console
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                Sign in
              </Button>
              <Button size="sm" onClick={() => navigate('/auth?mode=signup')}>
                Start free
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden rounded-md p-2 text-foreground hover:bg-secondary"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={cn(
          'overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl transition-[max-height,opacity] duration-400 md:hidden',
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => navigate('/auth')}>
              Sign in
            </Button>
            <Button className="flex-1" onClick={() => navigate(user ? '/dashboard' : '/auth?mode=signup')}>
              {user ? 'Console' : 'Start free'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingNav;
