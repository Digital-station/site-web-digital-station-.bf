'use client';

import { useCallback, useEffect } from 'react';
import type { KeyboardEvent, RefObject } from 'react';

/**
 * Background regions made `inert` while a dialog is open, when the caller
 * does not need anything more specific. Matched by selector because they are
 * typically rendered by the layout, outside the dialog's own component tree.
 */
const DEFAULT_INERT_SELECTORS = ['#main-content', 'footer'] as const;
const EMPTY_REFS: readonly RefObject<HTMLElement | null>[] = [];

/**
 * Everything inside a dialog that can take focus. `summary` is listed because
 * a disclosure group inside a dialog is a native <details>.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), summary, input, select, textarea, [tabindex]:not([tabindex="-1"])';

export type UseDialogOptions = {
  /** Whether the dialog is open. For a dialog that unmounts when closed
   *  (e.g. inside `{condition && <Dialog/>}` under AnimatePresence) this is
   *  simply `true` for its whole mounted lifetime — the hook treats unmount
   *  the same as an open-to-closed transition, see the focus effect below. */
  open: boolean;
  /** Called on Escape. The caller owns the open/closed state. */
  onClose: () => void;
  /** The dialog root. Tab cycling and the inert query both scope to its
   *  focusable descendants. */
  dialogRef: RefObject<HTMLElement | null>;
  /** Focused one frame after open. Defaults to the first focusable element
   *  inside `dialogRef`. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Focused on close. Omit to restore whatever had focus when the dialog
   *  opened — the right default for a dialog with more than one trigger. */
  returnFocusRef?: RefObject<HTMLElement | null>;
  /** Background regions made `inert` while open. Pass a module-level or
   *  memoized array — a fresh array literal every render defeats the
   *  effect's dependency comparison. Default: ['#main-content', 'footer']. */
  inertSelectors?: readonly string[];
  /** Extra elements made `inert` by ref rather than selector — e.g. a fixed
   *  header row that sits outside both #main-content and <footer>. Same
   *  stability requirement as `inertSelectors`. */
  inertRefs?: readonly RefObject<HTMLElement | null>[];
  /** Set false if the dialog is always mounted and the caller handles the
   *  body scroll lock itself. Default true. */
  lockScroll?: boolean;
};

/**
 * Shared a11y plumbing for a modal dialog: background `inert` + scroll lock,
 * focus-in on open, focus-restore on close (or unmount), Escape-to-close, and
 * Tab/Shift+Tab cycling within the dialog — `inert` alone does not trap
 * focus, since elements the layout renders outside every inert container
 * (a skip link, a sticky CTA) stay reachable by Tab.
 *
 * Extracted from the mobile nav drawer, where each of these behaviours fixed
 * a real bug (see git blame on components/layout/Navbar.tsx) — reuse this
 * rather than re-deriving them for a second dialog.
 */
export function useDialog({
  open,
  onClose,
  dialogRef,
  initialFocusRef,
  returnFocusRef,
  inertSelectors = DEFAULT_INERT_SELECTORS,
  inertRefs = EMPTY_REFS,
  lockScroll = true,
}: UseDialogOptions): { onKeyDown: (e: KeyboardEvent<HTMLElement>) => void } {
  useEffect(() => {
    if (lockScroll) document.body.style.overflow = open ? 'hidden' : '';

    const targets = [
      ...inertSelectors.flatMap((sel) => Array.from(document.querySelectorAll(sel))),
      ...inertRefs.map((r) => r.current),
    ].filter((el): el is Element => el !== null);
    targets.forEach((el) => {
      if (open) el.setAttribute('inert', '');
      else el.removeAttribute('inert');
    });

    return () => {
      if (lockScroll) document.body.style.overflow = '';
      targets.forEach((el) => el.removeAttribute('inert'));
    };
  }, [open, lockScroll, inertSelectors, inertRefs]);

  /**
   * Focus moves into the dialog on open. The restore-on-close happens in
   * this effect's CLEANUP rather than in a separate open-to-false branch, so
   * the same logic covers a dialog that toggles `open` while staying
   * mounted (the nav drawer) and one that unmounts outright when closed,
   * where `open` is always `true` for the component's whole lifetime and
   * the "close" signal is the unmount itself.
   */
  useEffect(() => {
    if (!open) return;

    const previouslyFocused =
      returnFocusRef?.current ?? (document.activeElement as HTMLElement | null);
    const target =
      initialFocusRef?.current ?? dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? null;
    const id = requestAnimationFrame(() => target?.focus());

    return () => {
      cancelAnimationFrame(id);
      previouslyFocused?.focus();
    };
  }, [open, initialFocusRef, returnFocusRef, dialogRef]);

  // Escape closes the dialog.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  /**
   * Tab / Shift+Tab cycle within the dialog. Cycling here closes the gap
   * `inert` alone leaves open, regardless of what the layout grows later.
   */
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key !== 'Tab') return;

      const root = dialogRef.current;
      if (!root) return;

      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        // offsetParent is null for anything display:none.
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [dialogRef],
  );

  return { onKeyDown };
}
