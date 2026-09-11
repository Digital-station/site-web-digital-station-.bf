import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useInView } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  Search,
  X,
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

/* ── TYPES ─────────────────────────────────────────────────── */

export interface IndustryItem {
  id: string;
  name: string;
  icon: LucideIcon;
  details?: string;
}

type AnimatedItem = IndustryItem & {
  distanceFromCenter: number;
  originalIndex: number;
};

/* ── DATA ──────────────────────────────────────────────────── */

const INDUSTRIES: IndustryItem[] = [
  {
    id: "healthcare",
    name: "Healthcare & Wellness",
    icon: HeartPulse,
    details: "Hospitals, clinics, telemedicine platforms",
  },
  {
    id: "finance",
    name: "Financial Services",
    icon: Landmark,
    details: "Banking, insurance, fintech & payments",
  },
  {
    id: "realestate",
    name: "Real Estate & Construction",
    icon: Building2,
    details: "Property management, PropTech, smart buildings",
  },
  {
    id: "retail",
    name: "Retail & E-Commerce",
    icon: ShoppingBag,
    details: "Online stores, POS, omnichannel retail",
  },
  {
    id: "education",
    name: "Education",
    icon: GraduationCap,
    details: "EdTech, LMS, academic & research institutions",
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Industrial",
    icon: Factory,
    details: "Industry 4.0, automation, supply chain",
  },
  {
    id: "agriculture",
    name: "Agriculture",
    icon: Wheat,
    details: "AgriTech, precision farming, food processing",
  },
  {
    id: "transport",
    name: "Transportation & Logistics",
    icon: Truck,
    details: "Fleet management, last-mile delivery, freight",
  },
  {
    id: "hospitality",
    name: "Hospitality & Tourism",
    icon: BedDouble,
    details: "Hotels, booking platforms, travel technology",
  },
  {
    id: "energy",
    name: "Energy & Utilities",
    icon: Zap,
    details: "Renewables, grid management, smart metering",
  },
  {
    id: "media",
    name: "Media & Entertainment",
    icon: Clapperboard,
    details: "Streaming, gaming, content & publishing platforms",
  },
  {
    id: "government",
    name: "Government & Nonprofit",
    icon: Scale,
    details: "Digital government, civic tech, NGO solutions",
  },
];

/* ── CAROUSEL CARD ─────────────────────────────────────────── */

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
  const yOffset = distanceFromCenter * 90;
  const xOffset = side === "left" ? -distance * 50 : distance * 50;

  return (
    <motion.div
      key={id}
      className={`absolute flex items-center gap-4 px-6 py-3 ${
        side === "left" ? "flex-row-reverse" : "flex-row"
      }`}
      animate={{
        opacity,
        scale,
        y: yOffset,
        x: xOffset,
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Icon container — dark brand chip */}
      <div className="rounded-full border border-brand-border bg-brand-surface p-2 shrink-0">
        <Icon className="size-8 text-brand-accent" />
      </div>

      <div
        className={`flex flex-col mx-4 ${
          side === "left" ? "text-right" : "text-left"
        }`}
      >
        <span className="text-md lg:text-lg font-semibold text-white whitespace-nowrap">
          {name}
        </span>
        <span className="text-xs lg:text-sm text-neutral-500">{details}</span>
      </div>
    </motion.div>
  );
};

/* ── MAIN COMPONENT ────────────────────────────────────────── */

export const IndustriesWeServe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const rightSectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rightSectionRef, {
    margin: "-100px 0px -100px 0px",
  });
  const totalItems = INDUSTRIES.length;

  /* ── Auto-scroll ─────────────────────────────── */
  useEffect(() => {
    if (isPaused || totalItems === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, 1800);
    return () => clearInterval(interval);
  }, [isPaused, totalItems]);

  /* ── Pause on user scroll ────────────────────── */
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      setIsPaused(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsPaused(false), 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  /* ── Visible items (mirrored left/right) ─────── */
  const getVisibleItems = useCallback((): AnimatedItem[] => {
    if (totalItems === 0) return [];
    const itemsToShow = 9; // odd for center anchoring
    const half = Math.floor(itemsToShow / 2);

    return Array.from({ length: itemsToShow }, (_, i) => {
      let index = currentIndex + (i - half);
      if (index < 0) index += totalItems;
      if (index >= totalItems) index -= totalItems;

      return {
        ...INDUSTRIES[index],
        originalIndex: index,
        distanceFromCenter: i - half,
      };
    });
  }, [currentIndex, totalItems]);

  /* ── Filtered search ─────────────────────────── */
  const filteredItems = useMemo(
    () =>
      INDUSTRIES.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm],
  );

  /* ── Select from dropdown ────────────────────── */
  const handleSelect = useCallback((id: string, name: string) => {
    const idx = INDUSTRIES.findIndex((c) => c.id === id);
    if (idx !== -1) {
      setCurrentIndex(idx);
      setIsPaused(true);
    }
    setSearchTerm(name);
    setShowDropdown(false);
  }, []);

  const currentItem = INDUSTRIES[currentIndex];

  /* ── RENDER ───────────────────────────────────── */
  return (
    <section
      id="industries"
      className="lg:pl-16 border-t border-brand-border py-20 md:py-32 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div className="mb-14 md:mb-20 text-center">
          <p className="text-brand-accent text-[10px] md:text-xs uppercase tracking-[0.4em] mb-6 font-mono font-bold">
            Our Domains
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white">
            Industries{" "}
            <span className="text-brand-accent italic font-serif font-light lowercase">
              We Serve
            </span>
          </h2>
          <p className="mt-6 text-neutral-500 text-sm md:text-base leading-relaxed font-light max-w-xl mx-auto">
            From healthcare to energy , our technology expertise spans every
            sector. We deliver tailored digital solutions wherever your
            organization operates.
          </p>
        </div>

        {/* Carousel zone */}
        <div className="flex flex-col xl:flex-row max-w-7xl mx-auto gap-12 justify-center items-center">
          {/* Left carousel (xl only) */}
          <motion.div
            className="relative w-full max-w-md xl:max-w-2xl h-[450px] flex items-center justify-center hidden xl:flex -left-14"
            onMouseEnter={() => !searchTerm && setIsPaused(true)}
            onMouseLeave={() => !searchTerm && setIsPaused(false)}
            initial={{ x: "-100%", opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              duration: 0.8,
            }}
          >
            {/* Fade overlays */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute top-0 h-1/4 w-full bg-gradient-to-b from-brand-primary to-transparent" />
              <div className="absolute bottom-0 h-1/4 w-full bg-gradient-to-t from-brand-primary to-transparent" />
            </div>

            {getVisibleItems().map((item) => (
              <CarouselItemCard key={item.id} item={item} side="left" />
            ))}
          </motion.div>

          {/* Center — current item + search */}
          <div className="flex flex-col text-center gap-4 max-w-md">
            {/* Currently selected */}
            {currentItem && (
              <div className="flex flex-col items-center justify-center gap-0 mt-4">
                <div className="p-2 bg-brand-surface rounded-full border border-brand-border">
                  <currentItem.icon className="size-12 text-brand-accent" />
                </div>
                <h3 className="text-xl xl:text-2xl font-bold text-white mt-2">
                  {currentItem.name}
                </h3>
                <p className="text-sm xl:text-lg text-neutral-500">
                  {currentItem.details || "View Details"}
                </p>
              </div>
            )}

            {/* Search bar */}
            <div className="mt-6 relative max-w-lg mx-auto xl:mx-0 w-full">
              <div className="px-3 flex items-center relative">
                <input
                  type="text"
                  value={searchTerm}
                  placeholder="Search industries…"
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchTerm(val);
                    setShowDropdown(val.length > 0);
                    if (val === "") setIsPaused(false);
                  }}
                  onFocus={() => {
                    if (searchTerm.length > 0) setShowDropdown(true);
                    setIsPaused(true);
                  }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="flex-grow outline-none text-white bg-brand-surface px-4 placeholder:text-neutral-500 text-lg rounded-full border border-brand-border pr-10 pl-10 py-2 cursor-pointer"
                />
                <Search className="absolute text-brand-accent/60 w-5 h-5 left-6 pointer-events-none" />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setShowDropdown(false);
                      setIsPaused(false);
                    }}
                    className="absolute right-6 text-neutral-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Dropdown */}
              {showDropdown && filteredItems.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-brand-surface rounded-lg border border-brand-border z-20 max-h-60 overflow-y-auto shadow-xl">
                  {filteredItems.slice(0, 10).map((item) => (
                    <div
                      key={item.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(item.id, item.name);
                      }}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.04] transition-colors rounded-lg m-2"
                    >
                      <item.icon size={24} className="text-brand-accent" />
                      <span className="text-white font-medium">
                        {item.name}
                      </span>
                      <span className="ml-auto text-sm text-neutral-500">
                        {item.details}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right carousel */}
          <motion.div
            ref={rightSectionRef}
            className="relative w-full max-w-md xl:max-w-2xl h-[450px] flex items-center justify-center -right-14"
            onMouseEnter={() => !searchTerm && setIsPaused(true)}
            onMouseLeave={() => !searchTerm && setIsPaused(false)}
            initial={{ x: "100%", opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              duration: 0.8,
            }}
          >
            {/* Fade overlays */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute top-0 h-1/4 w-full bg-gradient-to-b from-brand-primary to-transparent" />
              <div className="absolute bottom-0 h-1/4 w-full bg-gradient-to-t from-brand-primary to-transparent" />
            </div>

            {getVisibleItems().map((item) => (
              <CarouselItemCard key={item.id} item={item} side="right" />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
