import Image from 'next/image';
import { site } from '@/config/site.config';
import { cn } from '@/lib/utils';

type Variant = 'icon' | 'lockup';

type Props = {
  /** `icon` = hand mark only (navbar, rail). `lockup` = mark + wordmark + tagline. */
  variant?: Variant;
  /** Rendered height in pixels; width follows the artwork's true aspect ratio. */
  height?: number;
  className?: string;
};

/**
 * Digital Station logo, in the right colourway for the active theme.
 *
 * Both colourways are rendered and CSS hides the wrong one, rather than
 * choosing in JavaScript. That keeps this a SERVER component — no "use client",
 * no hydration flash — and the correct mark is painted on the very first frame
 * because `data-theme` is already on <html> by then.
 *
 * That only stays cheap while both images keep the default lazy loading: the
 * browser never fetches a lazy image that is `display: none`, so the hidden
 * colourway costs nothing. There used to be a `priority` prop, which made both
 * eager and preloaded — the navbar downloaded the wrong-theme logo on every
 * page. The server can't know the theme, so neither one can be preloaded.
 */
export function BrandMark({
  variant = 'icon',
  height = 40,
  className,
}: Props) {
  const isIcon = variant === 'icon';
  const ratio = isIcon ? site.brand.iconRatio : site.brand.lockupRatio;
  const width = Math.round(height * ratio);

  const alt = isIcon ? site.name : `${site.name} — ${site.tagline}`;

  const common = {
    width,
    height,
    className: cn('h-auto w-auto', className),
  };

  return (
    <>
      <Image
        {...common}
        alt={alt}
        src={isIcon ? site.brand.icon : site.brand.lockup}
        className={cn(common.className, 'only-light')}
      />
      {/* Same alt on both: `display: none` already removes the hidden variant
          from the accessibility tree, so exactly one name is ever announced.
          Marking either one aria-hidden would leave the logo nameless in one
          of the two themes. */}
      <Image
        {...common}
        alt={alt}
        src={isIcon ? site.brand.iconOnDark : site.brand.lockupOnDark}
        className={cn(common.className, 'only-dark')}
      />
    </>
  );
}
