import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Boxes,
  Rocket,
  Activity,
  ScrollText,
  Settings as SettingsIcon,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import KubeWheel from '@/components/brand/KubeWheel';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: Boxes, label: 'Applications', path: '/dashboard/applications' },
  { icon: Rocket, label: 'Deployments', path: '/dashboard/deployments' },
  { icon: Activity, label: 'Monitoring', path: '/dashboard/monitoring' },
  { icon: ScrollText, label: 'Audit log', path: '/dashboard/audit' },
  { icon: SettingsIcon, label: 'Settings', path: '/dashboard/settings' },
];

interface Props {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

const DashboardLayout = ({ children, title, subtitle, actions }: Props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    document.title = `${title} — AutoScaleX Console`;
  }, [title]);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const initials = (user?.user_metadata?.display_name || user?.email || 'U')
    .toString()
    .slice(0, 2)
    .toUpperCase();

  const nav = (onNavigate?: () => void) => (
    <nav className="flex-1 space-y-1 p-2">
      {navItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
              'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
              active
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
            )}
          >
            {active && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary" />}
            <item.icon
              className={cn(
                'h-[18px] w-[18px] shrink-0 transition-colors',
                active ? 'text-primary' : 'group-hover:text-primary',
              )}
            />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 md:flex',
          collapsed ? 'w-[68px]' : 'w-60',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary p-1.5 text-primary-foreground">
              <KubeWheel strokeWidth={7} />
            </span>
            {!collapsed && <span className="font-display text-sm">AutoScaleX</span>}
          </Link>
        </div>
        {nav()}
        <div className="space-y-1 border-t border-sidebar-border p-2">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          >
            {collapsed ? <PanelLeftOpen className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
            {!collapsed && <span>Collapse</span>}
          </button>
          <button
            onClick={async () => {
              await signOut();
              toast.success('Signed out');
              navigate('/');
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-[18px] w-[18px]" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar md:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
                <span className="font-display text-sm">AutoScaleX</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {nav(() => setMobileOpen(false))}
              <div className="border-t border-sidebar-border p-2">
                <button
                  onClick={async () => {
                    await signOut();
                    navigate('/');
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground hover:text-destructive"
                >
                  <LogOut className="h-[18px] w-[18px]" /> Sign out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className={cn('flex min-h-screen flex-col transition-[padding] duration-300', collapsed ? 'md:pl-[68px]' : 'md:pl-60')}>
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button className="rounded-md p-2 hover:bg-secondary md:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-display text-lg uppercase leading-none">{title}</h1>
                {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {actions}
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-mono text-[11px] font-semibold text-primary-foreground"
                title={user?.email ?? ''}
              >
                {initials}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
