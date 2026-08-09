import { Link } from 'react-router-dom';
import KubeWheel from '@/components/brand/KubeWheel';

const groups = [
  { title: 'Product', links: [['Platform', '#platform'], ['Pipeline', '#pipeline'], ['Connect cluster', '#connect'], ['Console', '/dashboard']] },
  { title: 'Resources', links: [['Manifests', '#connect'], ['Access', '#waitlist'], ['Sign in', '/auth']] },
];

const Footer = () => (
  <footer className="border-t border-border">
    <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 lg:px-14">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary p-1.5 text-primary-foreground">
              <KubeWheel strokeWidth={7} />
            </span>
            <span className="font-display text-base">AutoScaleX</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Kubernetes delivery for teams that would rather write product code than platform code.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{g.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {g.links.map(([label, href]) => (
                <li key={label}>
                  {href.startsWith('#') ? (
                    <a href={href} className="link-underline text-sm text-muted-foreground hover:text-foreground">
                      {label}
                    </a>
                  ) : (
                    <Link to={href} className="link-underline text-sm text-muted-foreground hover:text-foreground">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} AutoScaleX. All rights reserved.</p>
        <p className="font-mono">status: all systems operational</p>
      </div>
    </div>
  </footer>
);

export default Footer;
