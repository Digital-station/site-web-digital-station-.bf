'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'ds-theme';
const DEFAULT_THEME: Theme = 'dark';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Inline script injected into <head> before anything paints.
 *
 * Without this the page would render with the default dark palette and then
 * snap to light on hydration for anyone who chose light — the classic theme
 * flash. Reading localStorage synchronously here avoids it.
 *
 * It is wrapped in try/catch because localStorage throws outright in some
 * contexts (private windows with site data blocked, embedded previews).
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var theme = stored === 'light' || stored === 'dark' ? stored : '${DEFAULT_THEME}';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', '${DEFAULT_THEME}');
  }
})();
`;

/**
 * The pre-paint theme script, for <head>.
 *
 * In the server HTML it is an ordinary inline script and runs before first
 * paint. When React builds the document in the browser instead of hydrating
 * it (the dev server does this for every 404), an inline script it creates
 * never runs, and React 19 logs "Encountered a script tag while rendering
 * React component". On the client the element is therefore typed text/plain,
 * a data block: React stays quiet and nothing is lost, because the effect in
 * ThemeProvider applies the stored theme either way. suppressHydrationWarning
 * covers the `type` difference when the server element is hydrated, which is
 * harmless: by then the script has already run.
 */
export function ThemeScript() {
  return (
    <script
      type={typeof window === 'undefined' ? undefined : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Start from the default; the effect below reconciles with what the inline
  // script already put on <html>, so server and client markup agree.
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    /**
     * localStorage is the source of truth after hydration — ALWAYS, not only
     * when `data-theme` is missing.
     *
     * The earlier version trusted the attribute whenever it was present and
     * returned early. Since the server now stamps data-theme="dark" on every
     * response, the attribute is always present, so that branch always won and
     * localStorage was never consulted. Whenever the inline head script failed
     * to run — which does happen, because React can re-insert an inline
     * <script> during hydration and scripts inserted that way never execute —
     * a visitor who had chosen light silently got dark back on reload.
     *
     * Reconciling unconditionally makes the stored preference authoritative
     * regardless of whether the pre-paint script fired.
     */
    const root = document.documentElement;

    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // Storage unavailable (private window, blocked site data) — use default.
    }

    const next: Theme =
      stored === 'light' || stored === 'dark' ? stored : DEFAULT_THEME;

    if (root.getAttribute('data-theme') !== next) {
      root.setAttribute('data-theme', next);
    }
    // Deliberate one-time post-hydration sync with an external store
    // (localStorage); see the comment above.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(next);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable — the choice simply won't survive a reload.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
