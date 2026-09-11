'use client';

import { useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useTheme } from '@/components/providers/ThemeProvider';
import { cn } from '@/lib/utils';

/** The View Transitions API, typed just enough for the one call we make. */
type ViewTransitionish = { ready: Promise<void> };
type MaybeVTDocument = Document & {
  startViewTransition?: (callback: () => void) => ViewTransitionish;
};

/**
 * Light/dark switch — the Vite app's `lightswind/toggle-theme.tsx`, ported.
 *
 * Same button (round, borderless, 24px glyph, colour-only hover) and same
 * "circle-spread" reveal: the new theme is clipped to a circle that grows from
 * the button's centre to the far corner of the viewport, over a View
 * Transition snapshot. Differences from the original:
 *
 *   • State comes from `useTheme()` — `data-theme` on <html> plus the
 *     `ds-theme` key — instead of the reference's own `classList('dark')` and
 *     MutationObserver. One source of truth, and the pre-paint script in
 *     ThemeProvider keeps it flash-free.
 *   • Only `circle-spread` is ported. The reference shipped thirteen animation
 *     variants behind a prop; nothing selected any of the other twelve.
 *   • It degrades: no View Transitions support, or `prefers-reduced-motion`,
 *     and the theme simply flips.
 *
 * The glyph shows the theme you would GET by pressing, which is what the label
 * says too. No `aria-pressed`: the label changes with the state, so announcing
 * a pressed state as well would read as contradictory.
 */
export function ThemeToggle({
  className,
  duration = 400,
}: {
  className?: string;
  duration?: number;
}) {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('common');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isLight = theme === 'light';

  const handleClick = useCallback(async () => {
    const button = buttonRef.current;
    const startViewTransition = (document as MaybeVTDocument).startViewTransition;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!button || reduced || typeof startViewTransition !== 'function') {
      toggleTheme();
      return;
    }

    // flushSync so the attribute swap lands inside the transition's snapshot
    // rather than one React tick later, which would animate the old theme.
    await startViewTransition.call(document, () => {
      flushSync(() => {
        toggleTheme();
      });
    }).ready;

    const { top, left, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top),
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      },
    );
  }, [toggleTheme, duration]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      aria-label={isLight ? t('switchToDark') : t('switchToLight')}
      title={isLight ? t('switchToDark') : t('switchToLight')}
      className={cn(
        'h-11 w-11 shrink-0 rounded-full flex items-center justify-center',
        'text-brand-muted transition-colors duration-300',
        isLight ? 'hover:text-brand-accent' : 'hover:text-amber-400',
        'focus-visible:ring-2 focus-visible:ring-brand-accent',
        className,
      )}
    >
      {isLight ? (
        <Moon className="h-6 w-6" aria-hidden="true" />
      ) : (
        <Sun className="h-6 w-6" aria-hidden="true" />
      )}
    </button>
  );
}
