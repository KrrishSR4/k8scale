import { cn } from '@/lib/utils';

/** Points of a regular n-gon, flat-top oriented like the Kubernetes helm. */
const poly = (n: number, r: number, cx = 50, cy = 50, rot = -Math.PI / 2) =>
  Array.from({ length: n }, (_, i) => {
    const a = rot + (i * 2 * Math.PI) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  });

const pts = (p: readonly (readonly [number, number])[]) =>
  p.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

type Props = {
  className?: string;
  strokeWidth?: number;
  /** Renders the helm spokes + hub. Off = outline only. */
  detailed?: boolean;
};

/**
 * The Kubernetes helm: a seven-sided wheel with seven spokes.
 * Drawn with currentColor so it inherits semantic tokens.
 */
const KubeWheel = ({ className, strokeWidth = 4, detailed = true }: Props) => {
  const outer = poly(7, 46);
  const inner = poly(7, 20);

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      className={cn('h-full w-full', className)}
      aria-hidden="true"
      focusable="false"
    >
      <polygon points={pts(outer)} />
      {detailed && (
        <>
          <polygon points={pts(inner)} strokeWidth={strokeWidth * 0.75} />
          {outer.map(([x, y], i) => {
            const [ix, iy] = inner[i];
            return <line key={i} x1={ix} y1={iy} x2={x} y2={y} strokeWidth={strokeWidth * 0.7} />;
          })}
        </>
      )}
    </svg>
  );
};

export default KubeWheel;
