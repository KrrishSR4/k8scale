import mark from '@/assets/kube-mark.png.asset.json';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  /** 0–1 watermark strength. */
  opacity?: number;
};

/**
 * Decorative Kubernetes helm watermark. The source art is white-on-black,
 * so `mix-blend-screen` drops the black plate on dark surfaces.
 */
const KubeMark = ({ className, opacity = 0.06 }: Props) => (
  <div
    aria-hidden="true"
    style={{ opacity }}
    className={cn(
      'pointer-events-none absolute select-none mix-blend-screen',
      className,
    )}
  >
    <img src={mark.url} alt="" className="h-full w-full object-contain" loading="lazy" />
  </div>
);

export default KubeMark;
