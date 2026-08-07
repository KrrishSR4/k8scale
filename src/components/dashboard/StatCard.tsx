import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  trend?: number;
  className?: string;
}

const StatCard = ({ icon: Icon, label, value, hint, trend, className }: Props) => (
  <div className={cn('surface surface-hover group relative overflow-hidden p-5', className)}>
    <div className="flex items-start justify-between">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <Icon className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
    </div>
    <p className="mt-4 font-display text-3xl tabular-nums">{value}</p>
    {(hint || trend !== undefined) && (
      <p className="mt-1.5 text-xs text-muted-foreground">
        {trend !== undefined && (
          <span className={trend >= 0 ? 'text-success' : 'text-destructive'}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%{' '}
          </span>
        )}
        {hint}
      </p>
    )}
    <span className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />
  </div>
);

export default StatCard;
