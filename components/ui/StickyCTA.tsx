'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { usePathname } from '@/i18n/routing';
import { waHref } from '@/config/site.config';
import { WhatsAppIcon } from '@/components/ui/icons/WhatsApp';

/** Scroll distance before the button is offered at all. */
const REVEAL_AT = 120;

/**
 * Floating WhatsApp button.
 *
 * A 56×56 circular FAB, not the old full-width lozenge that sat on top of the
 * page content at every breakpoint. From `md` up it expands into a pill on
 * hover or keyboard focus to reveal its label; collapsed, the icon plus the
 * `aria-label` carry the meaning.
 *
 * It hides itself wherever it is noise rather than help: on the contact page,
 * which already offers every channel; while the footer is on screen, where it
 * would cover the footer's own contact block; and while a modal is open, where
 * it would otherwise float ON TOP of the modal (this sits at z-[100], the
 * mobile nav drawer at z-[60]) and stay clickable through it.
 */
export function StickyCTA() {
  const [scrolled, setScrolled] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const t = useTranslations('stickyCta');
  const tc = useTranslations('common');
  const pathname = usePathname();

  const isContactPage = pathname === '/contact';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > REVEAL_AT);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Step aside while the footer is on screen — the footer has its own
  // WhatsApp row, and the FAB would sit right on top of it.
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer || typeof IntersectionObserver !== 'function') return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);

  /**
   * Stand down while a modal is open, or while the cookie banner is showing.
   *
   * `aria-modal="true"` is the signal, rather than anything private to the
   * navbar: it is the standard semantic for "a modal is up", the nav drawer
   * already sets it, and keying off it means any future modal gets the same
   * treatment without touching this component again.
   *
   * The drawer also flips `inert` on `#main-content` / `<footer>`, but this FAB
   * is rendered by the layout OUTSIDE both of those, which is exactly why it
   * escaped in the first place — so it has to notice for itself.
   *
   * The cookie banner (`#cookie-consent`, bottom-left) is not a modal, but on
   * a phone it and this FAB share the same bottom strip, and a consent prompt
   * should not compete with a sales button. CookieConsent.tsx publishes
   * `data-state="open"` while it is showing.
   */
  useEffect(() => {
    if (typeof MutationObserver !== 'function') return;

    const sync = () =>
      setModalOpen(
        document.querySelector('[aria-modal="true"], #cookie-consent[data-state="open"]') !==
          null,
      );
    sync();

    /*
     * `childList` + `subtree` on <body> is deliberately broad: a modal may
     * be mounted with `aria-modal` ALREADY on it, so watching attribute
     * changes alone would never see it arrive. It is also cheaper than it
     * looks — MutationObserver batches records and invokes the callback
     * once per microtask checkpoint, not once per mutation, so a transition
     * inserting fifty nodes costs one `querySelector`, and React bails out
     * of the re-render when the boolean has not changed. Debouncing it
     * further would cost a frame of overlap with the modal, which is the
     * exact bug this observer exists to prevent.
     */
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-modal', 'data-state'],
    });
    return () => observer.disconnect();
  }, []);

  /**
   * The prefilled message names the page the visitor is writing from, so the
   * first WhatsApp message already carries context. The title is only known at
   * click time — it changes on every client-side navigation — so the href is
   * rewritten here, before the browser acts on it.
   */
  const handleClick = useCallback(() => {
    const link = linkRef.current;
    if (!link) return;
    const page = document.title.split(' | ')[0]?.trim();
    link.href = page
      ? waHref(t('whatsappMessageFrom', { page }))
      : waHref(t('whatsappMessage'));
  }, [t]);

  // Unmount outright while a modal or the cookie banner is up. Because the
  // FAB outranks both in the stacking order, any fade-out would keep it
  // painted — and clickable — on top of them for the whole animation.
  if (modalOpen) return null;

  const isVisible = scrolled && !isContactPage && !footerVisible;

  // One message for the eye and the ear: the hover pill shows the same words
  // the accessible name starts with (WCAG 2.5.3, label in name), plus a
  // new-tab warning that only assistive tech needs — the pill's icon and
  // `target` already imply it visually.
  const label = t('aria');

  return (
    <div className="fixed bottom-4 right-4 z-[100] xl:bottom-10 xl:right-10">
      {/* The entrance is a CSS transition, not Motion: `invisible` keeps the
          hidden button out of the Tab order and away from screen readers,
          the same way the navbar's mega-menu works. Reduced motion is
          covered by the global CSS kill-switch in globals.css. */}
      <div
        className={`transition-[opacity,translate,visibility] duration-300 ease-out motion-reduce:transition-none ${
          isVisible ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-6 invisible'
        }`}
      >
        <a
          ref={linkRef}
          href={waHref(t('whatsappMessage'))}
          onClick={handleClick}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} ${tc('newTab')}`}
          tabIndex={isVisible ? undefined : -1}
          className="group flex items-center rounded-full bg-brand-accent-strong text-brand-on-accent shadow-card ring-1 ring-brand-accent-ring transition-shadow hover:shadow-elevated focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          <span
            aria-hidden="true"
            className="hidden md:block max-w-0 overflow-hidden transition-[max-width] duration-300 ease-out group-hover:max-w-xs group-focus-visible:max-w-xs"
          >
            <span className="block whitespace-nowrap pl-6 text-xs font-black uppercase tracking-widest">
              {label}
            </span>
          </span>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center">
            <WhatsAppIcon size={26} />
          </span>
        </a>
      </div>
    </div>
  );
}
