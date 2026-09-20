import type { ReactNode } from 'react';

/**
 * Root layout.
 *
 * Deliberately a pass-through: the real <html>/<body> live in
 * app/[locale]/layout.tsx, because they need `lang={locale}` which is only
 * known once the locale segment has been resolved. Next.js still requires a
 * root layout to exist, so this file returns its children unchanged.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
