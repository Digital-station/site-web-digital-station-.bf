'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronDown, Menu, Sparkles, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link, usePathname } from '@/i18n/routing';
import { SERVICES } from '@/content/services';
import { site } from '@/config/site.config';
import { BrandMark } from '@/components/ui/BrandMark';
import { LocaleToggle } from '@/components/ui/LocaleToggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

const MEGA_MENU_ID = 'nav-services-menu';

/**
 * Page regions outside the drawer that must be hidden from AT and from Tab
 * while it is open. These are rendered by the layout, so they are matched by
 * selector; the navbar's own header row is added by ref in the effect below.
 */
const INERT_SELECTORS = ['#main-content', 'footer'];

/**
 * Everything inside the dialog that can take focus. `summary` is listed
 * because the services group is a native <details>.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), summary, input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const servicesWrapRef = useRef<HTMLDivElement>(null);
  const servicesTriggerRef = useRef<HTMLAnchorElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  /** False until the drawer has been opened once, so mount never steals focus. */
  const drawerWasOpen = useRef(false);
  /**
   * Set for the duration of the Escape-close only. Returning focus to the
   * trigger fires a focus event that bubbles to the mega-menu wrapper, whose
   * onFocus would otherwise reopen the panel Escape just closed — which is why
   * Escape used to need two presses.
   */
  const suppressServicesFocusOpen = useRef(false);

  // Locale-aware pathname: "/services", never "/fr/services".
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const ts = useTranslations('services.items');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the menus whenever the route changes. Reacting to the pathname
  // (an external value) inside an effect is the intended pattern here.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  /**
   * While the drawer is open everything behind it is `inert`: no tab stops, no
   * screen-reader access, no pointer events.
   *
   * That includes the navbar's OWN header row. It is a sibling of the drawer
   * inside this <nav>, so the burger and the logo stayed focusable behind the
   * backdrop and Shift+Tab off the close button walked straight out of the
   * dialog — breaking the aria-modal contract.
   *
   * `#main-content` and `<footer>` are rendered by the layout, outside this
   * component, so they are matched by selector; the header row comes from a
   * ref. Either way the attribute is set imperatively rather than as a prop.
   */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';

    const targets = [
      ...INERT_SELECTORS.flatMap((sel) => Array.from(document.querySelectorAll(sel))),
      headerRef.current,
    ].filter((el): el is Element => el !== null);
    targets.forEach((el) => {
      if (mobileMenuOpen) el.setAttribute('inert', '');
      else el.removeAttribute('inert');
    });

    return () => {
      document.body.style.overflow = '';
      targets.forEach((el) => el.removeAttribute('inert'));
    };
  }, [mobileMenuOpen]);

  // Focus moves into the drawer on open and back to the burger on close.
  useEffect(() => {
    if (mobileMenuOpen) {
      drawerWasOpen.current = true;
      const id = requestAnimationFrame(() => closeRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    if (drawerWasOpen.current) burgerRef.current?.focus();
  }, [mobileMenuOpen]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  /**
   * Tab / Shift+Tab cycle within the dialog.
   *
   * `inert` alone is not a complete trap: the skip link and the sticky CTA are
   * rendered by the layout outside every inert container, so Tab could still
   * walk out. Cycling here closes that gap and keeps holding regardless of what
   * the layout grows later.
   */
  const handleDrawerKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;

    const root = drawerRef.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      // offsetParent is null for anything display:none — notably the ten
      // service links while the <details> group is collapsed.
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
  }, []);

  /** Mega-menu closes only when focus leaves the wrapper entirely. */
  const handleServicesBlur = useCallback((e: FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && servicesWrapRef.current?.contains(next)) return;
    setServicesOpen(false);
  }, []);

  /**
   * Hover and keyboard focus both open the panel — except when focus is being
   * restored to the trigger by the Escape handler below.
   */
  const handleServicesFocus = useCallback(() => {
    if (suppressServicesFocusOpen.current) return;
    setServicesOpen(true);
  }, []);

  const handleServicesKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Escape') return;
    setServicesOpen(false);

    // focus() dispatches focusin synchronously, so the guard only has to hold
    // across this one call; clearing it right after keeps a later, deliberate
    // focus working. It also covers the case where the trigger already had
    // focus and no event fires at all.
    suppressServicesFocusOpen.current = true;
    servicesTriggerRef.current?.focus();
    suppressServicesFocusOpen.current = false;
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  /** Desktop text links. Contact is carried by the CTA button instead. */
  const secondaryLinks = [
    { href: '/solutions', label: t('solutions') },
    { href: '/about', label: t('about') },
  ] as const;

  /** Drawer order: home, solutions, about, contact — then the services group. */
  const drawerLinks = [
    { href: '/', label: t('home') },
    { href: '/solutions', label: t('solutions') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
  ] as const;

  return (
    <nav
      aria-label={t('menuLabel')}
      className={cn(
        'fixed top-0 right-0 left-0 lg:left-16 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-brand-primary/95 backdrop-blur-md h-16 border-b border-brand-border shadow-2xl'
          : 'bg-transparent h-24',
      )}
    >
      <div
        ref={headerRef}
        className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between"
      >
        <Link href="/" className="flex items-center gap-3">
          <BrandMark variant="icon" height={isScrolled ? 32 : 44} />
          <span className="font-display text-lg font-bold tracking-tighter uppercase hidden sm:inline">
            {site.name}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          <Link
            href="/"
            className={cn('nav-link', isActive('/') && 'text-brand-text')}
          >
            {t('home')}
          </Link>

          {/* Mega-menu: hover for the mouse, focus for the keyboard. Both open
              the same panel; it closes when focus leaves the wrapper, or on
              Escape, which also returns focus to the trigger. */}
          <div
            ref={servicesWrapRef}
            className="relative h-full flex items-center"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
            onFocus={handleServicesFocus}
            onBlur={handleServicesBlur}
            onKeyDown={handleServicesKeyDown}
          >
            <Link
              ref={servicesTriggerRef}
              href="/services"
              aria-expanded={servicesOpen}
              aria-controls={MEGA_MENU_ID}
              className={cn(
                'nav-link flex items-center gap-1',
                (servicesOpen || isActive('/services')) && 'text-brand-text font-bold',
              )}
            >
              {t('services')}
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  'w-3 h-3 transition-transform duration-300',
                  servicesOpen && 'rotate-180 text-brand-accent',
                )}
              />
            </Link>

            {/* Always rendered, shown and hidden with CSS. It used to mount
                only while open, so the ten service links were missing from
                the server HTML that crawlers read. `invisible` (visibility:
                hidden) still keeps the closed panel out of the Tab order and
                away from screen readers. */}
            <div
              id={MEGA_MENU_ID}
              className={cn(
                'absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[520px]',
                'transition-[opacity,translate,visibility] duration-200 motion-reduce:transition-none',
                servicesOpen
                  ? 'opacity-100 translate-y-0 visible'
                  : 'opacity-0 translate-y-2.5 invisible pointer-events-none',
              )}
            >
              <ul className="bg-brand-surface border border-brand-border p-8 rounded-2xl shadow-2xl grid grid-cols-2 gap-x-8 gap-y-6">
                {SERVICES.map((s) => (
                  <li key={s.num}>
                    <Link href={`/services/${s.slug}`} className="group/item rounded-md">
                      <div className="text-[11px] font-mono text-brand-accent mb-1 flex items-center gap-2">
                        <Sparkles className="w-2.5 h-2.5" aria-hidden="true" />
                        {s.num}
                      </div>
                      <div className="text-sm font-bold uppercase tracking-tighter mb-1 transition-colors group-hover/item:text-brand-accent">
                        {ts(`${s.slug}.title`)}
                      </div>
                      <div className="text-[11px] text-brand-muted leading-snug">
                        {ts(`${s.slug}.desc`)}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {secondaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn('nav-link', isActive(l.href) && 'text-brand-text')}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/contact"
            className="btn-primary px-5 py-3 text-[11px] font-black uppercase tracking-widest"
          >
            {tc('contactUs')}
          </Link>
          <LocaleToggle />
          <ThemeToggle />
        </div>

        <button
          ref={burgerRef}
          type="button"
          className="md:hidden -mr-2 h-11 w-11 flex items-center justify-center rounded-full hover:bg-brand-surface-2 transition-colors"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={mobileMenuOpen ? tc('closeMenu') : tc('openMenu')}
        >
          {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {/* ---- Mobile drawer ------------------------------------------------ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
            />

            <motion.div
              ref={drawerRef}
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label={t('menuLabel')}
              onKeyDown={handleDrawerKeyDown}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-[82%] h-[100dvh] bg-brand-primary z-[60] flex flex-col md:hidden border-l border-brand-border shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
            >
              <div className="h-16 px-6 flex items-center justify-between border-b border-brand-border shrink-0">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BrandMark variant="icon" height={28} />
                  <span className="font-display text-lg font-bold tracking-tighter uppercase">
                    {site.name}
                  </span>
                </Link>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={tc('closeMenu')}
                  className="-mr-2 h-11 w-11 flex items-center justify-center rounded-full hover:bg-brand-surface-2 transition-colors"
                >
                  <X className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>

              <div className="flex-1 px-6 py-6 flex flex-col gap-8 overflow-y-auto overscroll-contain">
                <ul className="flex flex-col gap-1">
                  {drawerLinks.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="py-2 text-3xl font-black uppercase tracking-tighter hover:text-brand-accent transition-colors block"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Ten service links would bury everything else, so they sit
                    behind a collapsed <details>. Native disclosure: keyboard
                    and screen-reader support come for free. */}
                <details className="group border-t border-brand-border pt-4">
                  <summary className="flex cursor-pointer items-center justify-between py-2 text-sm font-black uppercase tracking-widest text-brand-muted list-none [&::-webkit-details-marker]:hidden">
                    {t('servicesGroup', { count: SERVICES.length })}
                    <ChevronDown
                      aria-hidden="true"
                      className="w-4 h-4 shrink-0 transition-transform duration-300 group-open:rotate-180"
                    />
                  </summary>

                  <ul className="flex flex-col gap-1 pt-3 pl-2">
                    <li>
                      <Link
                        href="/services"
                        className="group/all flex items-center justify-between py-2 text-sm font-bold uppercase tracking-tighter text-brand-accent transition-colors"
                      >
                        {t('servicesEyebrow')}
                        <ArrowRight
                          aria-hidden="true"
                          className="w-4 h-4 opacity-0 -translate-x-4 transition-all group-hover/all:opacity-100 group-hover/all:translate-x-0"
                        />
                      </Link>
                    </li>
                    {SERVICES.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}`}
                          className="group/item flex items-center justify-between py-2 text-sm font-bold uppercase tracking-tighter text-brand-muted transition-all hover:text-brand-accent"
                        >
                          {ts(`${s.slug}.title`)}
                          <ArrowRight
                            aria-hidden="true"
                            className="w-4 h-4 text-brand-accent opacity-0 -translate-x-4 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>

                <div className="flex items-center gap-4 pt-4 border-t border-brand-border">
                  <LocaleToggle />
                  <ThemeToggle />
                </div>
              </div>

              <div className="p-6 border-t border-brand-border shrink-0 bg-brand-primary">
                <Link
                  href="/contact"
                  className="btn-primary block w-full py-5 text-lg uppercase font-black tracking-tighter"
                >
                  {tc('getStarted')}
                </Link>
                <p className="mt-3 text-center text-xs font-light text-brand-muted">
                  {tc('promise')}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
