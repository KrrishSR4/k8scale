import { cn } from '@/lib/utils';

const R = Math.PI / 180;
const P = (r: number, deg: number, cx = 50, cy = 50) =>
  [cx + r * Math.cos(deg * R), cy + r * Math.sin(deg * R)] as const;

const heptagon = Array.from({ length: 7 }, (_, i) => P(44, -90 + i * (360 / 7)))
  .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
  .join(' ');

const spokes = Array.from({ length: 7 }, (_, i) => -90 + i * (360 / 7));

type Props = {
  className?: string;
  /** 0–1 watermark strength. */
  opacity?: number;
};

/**
 * Decorative Kubernetes helm watermark — heptagon shell, seven-spoke ship's
 * wheel with knobbed handles and a hex hub. Pure SVG so it inherits
 * currentColor and never depends on a network asset.
 */
const KubeMark = ({ className, opacity = 0.12 }: Props) => (
  <div
    aria-hidden="true"
    style={{ opacity }}
    className={cn('pointer-events-none absolute select-none text-foreground', className)}
  >
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
    >
      <polygon points={heptagon} strokeWidth={3} />
      <circle cx="50" cy="50" r="26" strokeWidth={3} />
      <polygon
        points={Array.from({ length: 6 }, (_, i) => P(6, -90 + i * 60))
          .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
          .join(' ')}
        strokeWidth={2.5}
      />
      {spokes.map((a, i) => {
        const [x1, y1] = P(7, a);
        const [x2, y2] = P(34, a);
        const [kx, ky] = P(35.5, a);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={4} />
            <circle cx={kx} cy={ky} r={2.6} strokeWidth={2} />
          </g>
        );
      })}
    </svg>
  </div>
);

export default KubeMark;
