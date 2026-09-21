'use client';

import { useTranslations } from 'next-intl';

import {
  ThreeDScrollTriggerContainer,
  ThreeDScrollTriggerRow,
  useThreeDScrollTriggerControls,
} from '@/components/lib/ThreeDScrollTrigger';

import { MotionProvider } from '@/components/providers/MotionProvider';

import { ToolCard } from './ToolCard';
import { TOOLS_ROW_1, TOOLS_ROW_2 } from './tools-data';

/** Keyboard/touch-reachable equivalent to the hover-to-pause behavior. */
function MarquePauseButton() {
  const t = useTranslations('home.tools');
  const controls = useThreeDScrollTriggerControls();
  if (!controls) return null;

  return (
    <button
      type="button"
      onClick={controls.toggle}
      aria-pressed={controls.paused}
      aria-label={controls.paused ? t('play') : t('pause')}
      title={controls.paused ? t('play') : t('pause')}
      className="absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-surface ring-1 ring-brand-border text-brand-text transition-colors hover:bg-brand-border/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
    >
      {controls.paused ? (
        <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
          <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
        </svg>
      )}
    </button>
  );
}

/**
 * The animated half of the tools section, in its own module so
 * `ToolsWeMaster` can pull it in with `next/dynamic` (`ssr: false`).
 * The scroll-velocity marquee needs `useScroll`/`useVelocity`, which are
 * useless on the server and cost ~15 KB of Motion internals on the client.
 */
export function ToolsMarquee() {
  return (
    // MotionConfig lives on each motion subtree (not the layout): importing
    // it globally would drag the whole Motion barrel into every page's
    // initial bundle. See providers/MotionProvider.tsx.
    <MotionProvider>
    <ThreeDScrollTriggerContainer className="pr-12">
      <MarquePauseButton />

      <ThreeDScrollTriggerRow direction={1} baseVelocity={3} className="mb-5 md:mb-8">
        {TOOLS_ROW_1.map((tool) => (
          <ToolCard key={tool.name} {...tool} />
        ))}
      </ThreeDScrollTriggerRow>

      <ThreeDScrollTriggerRow direction={-1} baseVelocity={3}>
        {TOOLS_ROW_2.map((tool) => (
          <ToolCard key={tool.name} {...tool} />
        ))}
      </ThreeDScrollTriggerRow>
    </ThreeDScrollTriggerContainer>
    </MotionProvider>
  );
}
