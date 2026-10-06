'use client';

import dynamic from 'next/dynamic';
import type { KnowledgeConvergenceProps } from '@/components/lightswind/knowledge-convergence';

/**
 * `next/dynamic`'s `ssr: false` is only valid inside a client component, so
 * this one-line wrapper is what lets `ScopeSection` (ServiceDetail.tsx) stay
 * a server component while still code-splitting the ~400 lines of SVG + SMIL
 * that `KnowledgeConvergence` is made of into its own, client-only chunk.
 */
const KnowledgeConvergence = dynamic(
  () =>
    import('@/components/lightswind/knowledge-convergence').then(
      (m) => m.KnowledgeConvergence,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[420px] md:min-h-[500px]" aria-hidden="true" />
    ),
  },
);

export function KnowledgeConvergenceLazy(props: KnowledgeConvergenceProps) {
  return <KnowledgeConvergence {...props} />;
}
