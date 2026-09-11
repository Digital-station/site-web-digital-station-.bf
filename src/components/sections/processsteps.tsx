/**
 * « The Momentum Process » — faithful conversion of the original
 * Creative Momentum markup into a valid React component.
 *
 * Per spec: the original images, layout/design and copy are preserved.
 * ONLY the theme colors are adapted to the dark brand system.
 *
 * NOTE — things you will likely want to adjust later (kept faithful on
 * purpose, not auto-changed):
 *   • Copy is in English; the rest of the site is French.
 *   • The aside still links out to thecreativemomentum.com and the
 *     testimonial quotes that firm by name — both inherited from the
 *     original markup. Say the word to localize/replace.
 */

/* ── ORIGINAL IMAGES (kept verbatim, unchanged) ────────────── */

const ICONS = {
  meet: "https://www.thecreativemomentum.com/hubfs/Creative%20Momentum/SEO%20images/Atlanta%20Web%20Design%20Firm%20(3).svg",
  plan: "https://www.thecreativemomentum.com/hubfs/Creative%20Momentum/SEO%20images/Atlanta%20Web%20Design%20Firm%20(5).svg",
  web: "https://www.thecreativemomentum.com/hubfs/Creative%20Momentum/SEO%20images/Atlanta%20Web%20Design%20Firm%20(8).svg",
  testing:
    "https://www.thecreativemomentum.com/hubfs/Creative%20Momentum/SEO%20images/Atlanta%20Web%20Design%20Agency%20(10).svg",
  launch:
    "https://www.thecreativemomentum.com/hubfs/Creative%20Momentum/SEO%20images/Atlanta%20Web%20Design%20Agency%20(12).svg",
  aside:
    "https://www.thecreativemomentum.com/hubfs/Creative%20Momentum/SEO%20images/Atlanta%20Web%20Design%20Firm%20(6).svg",
  testimonial:
    "https://www.thecreativemomentum.com/hubfs/Creative%20Momentum/SEO%20images/Atlanta%20Web%20Design%20Agency%20(13).svg",
  polygon:
    "https://www.thecreativemomentum.com/hubfs/Creative%20Momentum/images/Polygon%202.svg",
};

const ARROWS = {
  /* horizontal: Meet → Plan (top row) */
  top: "https://www.thecreativemomentum.com/hubfs/Creative%20Momentum/SEO%20images/Atlanta%20Web%20Design%20Firm%20(4).svg",
  /* vertical curve: top row → middle */
  down1:
    "https://www.thecreativemomentum.com/hubfs/Creative%20Momentum/SEO%20images/Atlanta%20Web%20Design%20Firm%20(9).svg",
  /* vertical curve: middle → bottom row */
  down2:
    "https://www.thecreativemomentum.com/hubfs/Creative%20Momentum/SEO%20images/Atlanta%20Web%20Design%20Firm%20(7).svg",
  /* horizontal: Testing → Launch (bottom row) */
  bottom1:
    "https://www.thecreativemomentum.com/hubfs/Creative%20Momentum/SEO%20images/Atlanta%20Web%20Design%20Agency%20(11).svg",
  bottom2:
    "https://www.thecreativemomentum.com/hubfs/Creative%20Momentum/SEO%20images/Atlanta%20Web%20Design%20Agency%20(34).svg",
};

/* ── STEP ──────────────────────────────────────────────────── */

const Step = ({
  icon,
  alt,
  title,
  desc,
  align = "left",
}: {
  icon: string;
  alt: string;
  title: string;
  desc: string;
  align?: "left" | "right";
}) => (
  <div
    className={`group flex items-start gap-5 md:gap-6 max-w-sm ${
      align === "right" ? "md:flex-row-reverse md:text-right" : ""
    }`}
  >
    <img
      src={icon}
      alt={alt}
      loading="lazy"
      className="h-14 md:h-20 w-auto shrink-0 transition-transform duration-500 group-hover:scale-105"
    />
    <div>
      <h3 className="text-lg md:text-2xl font-black uppercase tracking-tighter text-white mb-3 transition-colors duration-500 group-hover:text-brand-accent">
        {title}
      </h3>
      <p className="text-sm md:text-base leading-relaxed font-light text-neutral-500">
        {desc}
      </p>
    </div>
  </div>
);

/* tiny vertical/horizontal arrow helper */
const Arrow = ({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className={`h-8 md:h-10 w-auto opacity-80 ${className}`}
  />
);

/* ── SECTION ───────────────────────────────────────────────── */

export const Process = () => {
  return (
    <section className="lg:pl-16 border-t border-brand-border bg-brand-primary py-20 md:py-32 relative overflow-hidden">
      {/* Planar lines backdrop (original Polygon 2, kept faint) */}
      <img
        src={ICONS.polygon}
        alt=""
        aria-hidden
        className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[1000px] opacity-[0.06]"
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter text-white text-center mb-16 md:mb-24">
          The Momentum Process
        </h2>

        {/* TOP ROW — Meet → Plan */}
        <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-10">
          <div className="md:justify-self-start">
            <Step
              icon={ICONS.meet}
              alt="Atlanta Web Design Firm"
              title="Meet"
              desc="The first step is to discover more about you, your company's vision, and to build a strong relationship. This is where we will create your brand, create a custom strategy, and set project goals."
            />
          </div>
          <Arrow
            src={ARROWS.top}
            alt="Atlanta Web Design Firm"
            className="hidden md:block mx-auto"
          />
          <div className="md:justify-self-end">
            <Step
              icon={ICONS.plan}
              alt="Atlanta Web Design Firm"
              title="Plan"
              align="right"
              desc="Following the initial meetup, we will outline your web design, PPC, inbound marketing or content marketing project. Create milestones, and agree on priorities. Now we have a strategic plan in place that aligns with your initial vision and makes your goals achievable."
            />
          </div>
        </div>

        {/* Connector down to middle */}
        <Arrow
          src={ARROWS.down1}
          alt="Atlanta Web Design Firm"
          className="hidden md:block mx-auto my-8 md:my-12"
        />

        {/* MIDDLE — Web Design & Dev (centered) */}
        <div className="flex justify-center">
          <div className="max-w-md text-center">
            <Step
              icon={ICONS.web}
              alt="Atlanta Web Design Firm"
              title="Web Design & Dev"
              desc="Once the outline is finished, visual concepts of the custom project will be created. Our creative and dev team reviews and revises the materials until it aligns with your web design goals."
            />
          </div>
        </div>

        {/* Connector down to bottom */}
        <Arrow
          src={ARROWS.down2}
          alt="Atlanta Web Design Firm"
          className="hidden md:block mx-auto my-8 md:my-12"
        />

        {/* BOTTOM ROW — Testing → Launch */}
        <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-10">
          <div className="md:justify-self-start">
            <Step
              icon={ICONS.testing}
              alt="Atlanta Web Design Agency"
              title="Testing"
              desc="Here review and testing takes place, which ensures the quality of your project. This is the most valuable step in the web design process, because your reputation is our reputation!"
            />
          </div>
          <div className="hidden md:flex items-center gap-1">
            <Arrow src={ARROWS.bottom1} alt="Atlanta Web Design Firm" />
            <Arrow src={ARROWS.bottom2} alt="Atlanta Web Design Firm" />
          </div>
          <div className="md:justify-self-end">
            <Step
              icon={ICONS.launch}
              alt="Atlanta Web Design Agency"
              title="Launch"
              align="right"
              desc="Here is where we present your custom web design project. Upon approval, your project will be launched and promoted. Then sit back and watch the momentum!"
            />
          </div>
        </div>

        {/* ASIDE — "Who is behind the work?" (original btw-item) */}
        <div className="mt-16 md:mt-24 mx-auto max-w-md border border-brand-border rounded-2xl bg-brand-surface p-8 flex flex-col items-center text-center gap-5">
          <img
            src={ICONS.aside}
            alt="Atlanta Web Design Firm"
            loading="lazy"
            className="h-16 md:h-24 w-auto"
          />
          <div className="detail-content">
            <p className="text-white font-light mb-3">
              Who is behind the work?
            </p>
            <p>
              <a
                href="https://www.thecreativemomentum.com/studio_bu?utm_source=clutch.co&utm_medium=referral&utm_campaign=web-designers"
                rel="noopener"
                className="text-brand-accent font-bold hover:underline underline-offset-4"
              >
                See here
              </a>
            </p>
          </div>
        </div>

        {/* TESTIMONIAL (original process-testimonial) */}
        <div className="mt-20 md:mt-28 border-t border-brand-border pt-14 md:pt-20 flex flex-col md:flex-row items-center gap-8 md:gap-14">
          <img
            src={ICONS.testimonial}
            alt="Atlanta Web Design Agency"
            loading="lazy"
            className="h-24 md:h-32 w-auto shrink-0"
          />
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-brand-accent mb-5">
              What our lovely customers say:
            </h4>
            <blockquote className="text-base md:text-lg leading-relaxed font-light text-neutral-300 italic max-w-3xl">
              We couldn’t be more pleased with The Creative Momentum. Their
              ability to quickly translate our ideas into a fresh, clean,
              easy-to-navigate UI was phenomenal. The code The Creative Momentum
              produced was so organized and required such little re-work to
              incorporate that our dev team still thanks me for using them!
            </blockquote>
            <p className="auth-info mt-6 text-sm text-neutral-500">
              <small className="text-white font-bold not-italic">
                Karen Beatrice
              </small>
              <br />
              MobileLabs, Inc.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
