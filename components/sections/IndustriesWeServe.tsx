"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useId,
  type KeyboardEvent,
} from "react";
import { useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";
import {
  Search,
  X,
  Pause,
  Play,
  HeartPulse,
  Landmark,
  Building2,
  ShoppingBag,
  GraduationCap,
  Factory,
  Wheat,
  Truck,
  BedDouble,
  Zap,
  Clapperboard,
  Scale,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* ── TYPES ─────────────────────────────────────────────────── */

interface IndustryItem {
  id: string;
  name: string;
  details: string;
  icon: LucideIcon;
}

type AnimatedItem = IndustryItem & {
  distanceFromCenter: number;
  originalIndex: number;
};

/* ── DATA ──────────────────────────────────────────────────── */
/* Only the id and icon live here. Names and details come from
   messages/<locale>.json under `home.industries.items.<id>`, so the
   carousel and its search box work in both languages. */

const INDUSTRY_ICONS: { id: string; icon: LucideIcon }[] = [
  { id: "healthcare", icon: HeartPulse },
  { id: "finance", icon: Landmark },
  { id: "realestate", icon: Building2 },
  { id: "retail", icon: ShoppingBag },
  { id: "education", icon: GraduationCap },
  { id: "manufacturing", icon: Factory },
  { id: "agriculture", icon: Wheat },
  { id: "transport", icon: Truck },
  { id: "hospitality", icon: BedDouble },
  { id: "energy", icon: Zap },
  { id: "media", icon: Clapperboard },
  { id: "government", icon: Scale },
];

/* ── CAROUSEL CARD ─────────────────────────────────────────── */

/** Vertical distance between neighbouring side-column cards, in px. */
const CARD_PITCH = 120;
/** Odd, so one item anchors the centre. 7 × 120px fits the 520px column. */
const ITEMS_TO_SHOW = 7;

const CarouselItemCard = ({
  item,
  side,
}: {
  item: AnimatedItem;
  side: "left" | "right";
}) => {
  const { distanceFromCenter, id, name, details, icon: Icon } = item;
  const distance = Math.abs(distanceFromCenter);
  const opacity = 1 - distance / 4;
  const scale = 1 - distance * 0.1;
  // Pitch ≥ card height, or neighbours overlap. The card is a fixed 96px
  // (see below), and 120px leaves room for the scale() of the centre card.
  const yOffset = distanceFromCenter * CARD_PITCH;
  const xOffset = side === "left" ? -distance * 18 : distance * 18;

  // Was `motion.div animate={...}`: the values are already computed in JS,
  // so plain CSS transitions on the independent `translate`/`scale`
  // properties render the identical tween with zero Motion runtime. The
  // transition only exists under `motion-safe` — reduced-motion visitors
  // get the instant swap (better than the old fade).
  //
  // Fixed height + line clamps: the cards are absolutely positioned on a
  // fixed pitch, so a long name wrapping to two lines (or a three-line
  // "details" in French) used to grow the card into its neighbour.
  return (
    <div
      key={id}
      style={{ opacity, scale, translate: `${xOffset}px ${yOffset}px` }}
      className={`absolute flex h-[96px] max-w-[320px] items-center gap-4 px-6 py-3 motion-safe:transition-[opacity,scale,translate] motion-safe:duration-400 motion-safe:ease-in-out ${
        side === "left" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="rounded-full border border-brand-border bg-brand-surface p-2 shrink-0">
        <Icon className="size-8 text-brand-accent" />
      </div>

      <div
        className={`flex flex-col mx-4 min-w-0 ${
          side === "left" ? "text-right" : "text-left"
        }`}
      >
        <span className="text-base lg:text-lg font-semibold line-clamp-1">
          {name}
        </span>
        <span className="text-xs lg:text-sm text-brand-faint line-clamp-2">
          {details}
        </span>
      </div>
    </div>
  );
};

/* ── MAIN COMPONENT ────────────────────────────────────────── */

export function IndustriesWeServe() {
  const t = useTranslations("home.industries");
  const reduced = useReducedMotion();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  /**
   * Why the rotation is stopped.
   * Hover and keyboard focus pause it in passing; the visible pause button
   * is the explicit control WCAG 2.2.2 asks for (hover is not a mechanism a
   * touch or switch user has); a non-empty search holds the chosen industry
   * in the centre.
   */
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const isPaused = manualPaused || hovered || focused || searchTerm !== "";

  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const optionId = (id: string) => `${listId}-${id}`;

  const carouselRowRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = carouselRowRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { rootMargin: "50px 0px 50px 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Resolve translated labels once per render rather than per carousel card.
  const industries: IndustryItem[] = useMemo(
    () =>
      INDUSTRY_ICONS.map(({ id, icon }) => ({
        id,
        icon,
        name: t(`items.${id}.name`),
        details: t(`items.${id}.details`),
      })),
    [t],
  );

  const totalItems = industries.length;

  /* ── Auto-scroll ─────────────────────────────── */
  // Begins immediately upon reaching the section and advances smoothly.
  useEffect(() => {
    if (reduced || isPaused || !isInView || totalItems === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, 1800);
    return () => clearInterval(interval);
  }, [reduced, isPaused, isInView, totalItems]);

  /* ── Visible items (mirrored left/right) ─────── */
  const getVisibleItems = useCallback((): AnimatedItem[] => {
    if (totalItems === 0) return [];
    const half = Math.floor(ITEMS_TO_SHOW / 2);

    return Array.from({ length: ITEMS_TO_SHOW }, (_, i) => {
      let index = currentIndex + (i - half);
      if (index < 0) index += totalItems;
      if (index >= totalItems) index -= totalItems;

      return {
        ...industries[index],
        originalIndex: index,
        distanceFromCenter: i - half,
      };
    });
  }, [currentIndex, totalItems, industries]);

  /* ── Search filter (matches the translated name) ── */
  const filteredItems = useMemo(
    () =>
      industries.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm, industries],
  );

  const handleSelect = useCallback(
    (id: string, name: string) => {
      const idx = industries.findIndex((c) => c.id === id);
      if (idx !== -1) setCurrentIndex(idx);
      setSearchTerm(name);
      setShowDropdown(false);
      setActiveIndex(-1);
    },
    [industries],
  );

  const clearSearch = () => {
    setSearchTerm("");
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  const isOpen = showDropdown && filteredItems.length > 0;

  /* ── Combobox keyboard (WAI-ARIA APG, list autocomplete) ── */
  // Focus stays in the input; aria-activedescendant names the highlighted
  // option. ArrowDown on an empty box opens the full list.
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const count = filteredItems.length;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        if (count === 0) return;
        e.preventDefault();
        const down = e.key === "ArrowDown";
        if (!isOpen) {
          setShowDropdown(true);
          setActiveIndex(down ? 0 : count - 1);
          return;
        }
        setActiveIndex((i) =>
          down ? (i + 1) % count : i <= 0 ? count - 1 : i - 1,
        );
        return;
      }
      case "Enter": {
        const item = isOpen ? filteredItems[activeIndex] : undefined;
        if (!item) return;
        e.preventDefault();
        handleSelect(item.id, item.name);
        return;
      }
      case "Escape":
        if (isOpen) {
          e.preventDefault();
          setShowDropdown(false);
          setActiveIndex(-1);
        } else if (searchTerm) {
          e.preventDefault();
          clearSearch();
        }
        return;
    }
  };

  // Keep the highlighted option inside the scrollable list.
  useEffect(() => {
    const item = filteredItems[activeIndex];
    if (!isOpen || !item) return;
    document
      .getElementById(`${listId}-${item.id}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen, filteredItems, listId]);

  const currentItem = industries[currentIndex];

  // No Motion here anymore: the card tweens are CSS transitions on the
  // independent `translate`/`scale` properties and the column slide-ins are
  // an `isInView` class toggle. Same pixels, ~126 KB less JS.
  return (
    <section
      id="industries"
      className="lg:pl-16 border-t border-brand-border py-12 lg:py-16 overflow-hidden"
    >
      <Container>
        <div className="mb-14 md:mb-20 text-center">
          <p className="text-brand-accent text-[11px] md:text-xs uppercase tracking-wide mb-6 font-mono font-bold">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[1.15] text-balance break-words">
            {t("titleLead")}{" "}
            <span className="text-brand-accent italic font-serif font-light lowercase">
              {t("titleAccent")}
            </span>
          </h2>
          <p className="mt-6 text-brand-muted text-sm md:text-base leading-relaxed font-light max-w-xl mx-auto">
            {t("body")}
          </p>
        </div>

        <div
          ref={carouselRowRef}
          className="flex flex-col xl:flex-row max-w-7xl mx-auto gap-12 justify-center items-center"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
          }}
        >
          {/* Left carousel (xl and up). Hidden from assistive tech: it repeats
            the names in motion, and the list below reads them once. */}
          {/* Was a motion spring slide-in; a class toggle on the same
            `isInView` flag with a CSS transition reads the same. No
            transition under reduced motion: the column just appears. */}
          <div
            aria-hidden="true"
            className={`relative w-full max-w-md xl:max-w-2xl xl:h-[520px] items-center justify-center hidden xl:flex -left-14 motion-safe:transition-[translate,opacity] motion-safe:duration-700 motion-safe:ease-out ${
              isInView
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }`}
          >
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute top-0 h-1/4 w-full bg-gradient-to-b from-brand-primary to-transparent" />
              <div className="absolute bottom-0 h-1/4 w-full bg-gradient-to-t from-brand-primary to-transparent" />
            </div>

            {getVisibleItems().map((item) => (
              <CarouselItemCard key={item.id} item={item} side="left" />
            ))}
          </div>

          {/* Centre — current item + search */}
          <div className="flex flex-col text-center gap-4 max-w-md">
            {/* The rotating display changes every 1.8 s; a screen reader gets
              the whole list, once, instead. */}
            <ul className="sr-only">
              {industries.map((item) => (
                <li key={item.id}>
                  {item.name}, {item.details}
                </li>
              ))}
            </ul>

            {currentItem && (
              <div
                aria-hidden="true"
                className="flex flex-col items-center justify-center gap-0 mt-4"
              >
                <div className="p-2 bg-brand-surface rounded-full border border-brand-border">
                  <currentItem.icon className="size-12 text-brand-accent" />
                </div>
                <h3 className="text-xl xl:text-2xl font-bold mt-2">
                  {currentItem.name}
                </h3>
                <p className="text-sm xl:text-lg text-brand-faint">
                  {currentItem.details}
                </p>
              </div>
            )}

            <div className="mt-6 relative max-w-lg mx-auto xl:mx-0 w-full">
              <div className="px-3 flex items-center relative">
                {/* No `outline-none`: the global :focus-visible ring shows. */}
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-controls={listId}
                  aria-autocomplete="list"
                  aria-activedescendant={
                    isOpen && filteredItems[activeIndex]
                      ? optionId(filteredItems[activeIndex].id)
                      : undefined
                  }
                  autoComplete="off"
                  value={searchTerm}
                  placeholder={t("searchPlaceholder")}
                  aria-label={t("searchPlaceholder")}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchTerm(val);
                    setShowDropdown(val.length > 0);
                    setActiveIndex(-1);
                  }}
                  onFocus={() => {
                    if (searchTerm.length > 0) setShowDropdown(true);
                  }}
                  onBlur={() => {
                    setShowDropdown(false);
                    setActiveIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  className="flex-grow bg-brand-surface px-4 placeholder:text-brand-faint text-lg rounded-full border border-brand-field pr-10 pl-10 py-2"
                />
                <Search
                  aria-hidden="true"
                  className="absolute text-brand-accent/60 w-5 h-5 left-6 pointer-events-none"
                />
                {searchTerm && (
                  /* A 28px target (the icon was the whole 20px target),
                   centred where the icon was. */
                  <button
                    type="button"
                    aria-label={t("clearSearch")}
                    onClick={() => {
                      clearSearch();
                      inputRef.current?.focus();
                    }}
                    className="absolute right-5 size-7 flex items-center justify-center rounded-full text-brand-faint hover:text-brand-text transition-colors"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                )}
              </div>

              {/* Always in the DOM so aria-controls resolves; `hidden` when
                closed. Mousedown is cancelled so a click (or a drag on the
                scrollbar) does not blur the input first. */}
              <ul
                id={listId}
                role="listbox"
                aria-label={t("searchPlaceholder")}
                hidden={!isOpen}
                onMouseDown={(e) => e.preventDefault()}
                className="absolute left-0 right-0 mt-2 bg-brand-surface rounded-lg border border-brand-border z-20 max-h-60 overflow-y-auto shadow-xl"
              >
                {filteredItems.map((item, i) => (
                  <li
                    key={item.id}
                    id={optionId(item.id)}
                    role="option"
                    aria-selected={i === activeIndex}
                    onClick={() => handleSelect(item.id, item.name)}
                    onMouseMove={() => i !== activeIndex && setActiveIndex(i)}
                    className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-brand-accent-soft aria-selected:bg-brand-accent-soft transition-colors rounded-lg text-left"
                  >
                    <item.icon
                      size={24}
                      aria-hidden="true"
                      className="text-brand-accent shrink-0"
                    />
                    <span className="font-medium">{item.name}</span>
                    <span className="ml-auto text-sm text-brand-faint hidden sm:inline">
                      {item.details}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Search feedback for screen readers: the listbox is visual
                  only until an option is highlighted, and "no result" has no
                  visible state at all (the list simply stays hidden). Empty
                  while the box is empty, so nothing is announced on load. */}
              <p role="status" className="sr-only">
                {searchTerm
                  ? t("resultCount", { count: filteredItems.length })
                  : ""}
              </p>
            </div>

            {/* Same pattern as ToolsMarquee's pause button: the label swaps
                between pause and play, so no aria-pressed on top of it. */}
            <button
              type="button"
              onClick={() => setManualPaused((v) => !v)}
              aria-label={manualPaused ? t("play") : t("pause")}
              title={manualPaused ? t("play") : t("pause")}
              className="mx-auto mt-2 flex h-11 w-11 items-center justify-center rounded-full bg-brand-surface ring-1 ring-brand-border text-brand-text transition-colors hover:bg-brand-border/40"
            >
              {manualPaused ? (
                <Play className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Pause className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Right carousel (xl and up) */}
          <div
            aria-hidden="true"
            className={`relative w-full max-w-md xl:max-w-2xl xl:h-[520px] items-center justify-center hidden xl:flex -right-14 motion-safe:transition-[translate,opacity] motion-safe:duration-700 motion-safe:ease-out ${
              isInView
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute top-0 h-1/4 w-full bg-gradient-to-b from-brand-primary to-transparent" />
              <div className="absolute bottom-0 h-1/4 w-full bg-gradient-to-t from-brand-primary to-transparent" />
            </div>

            {getVisibleItems().map((item) => (
              <CarouselItemCard key={item.id} item={item} side="right" />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
