import logo from '@/assets/kube-logo.png';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  /** Adds the slow helm rotation on hover of the parent `.group`. */
  spinOnHover?: boolean;
};

/** The AutoScaleX helm mark — the same asset used as the favicon. */
const BrandLogo = ({ className, spinOnHover = true }: Props) => (
  <img
    src={logo}
    alt=""
    aria-hidden="true"
    draggable={false}
    className={cn(
      'h-full w-full select-none object-contain',
      spinOnHover && 'transition-transform duration-700 ease-out group-hover:rotate-[51.43deg]',
      className,
    )}
  />
);

export default BrandLogo;
