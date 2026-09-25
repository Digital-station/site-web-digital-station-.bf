"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { Container } from "@/components/layout/Container";

/* ── Illustrations (self-hosted, brand-recoloured) ────────────────────────── */

const ICONS = {
  meet: { src: "/process/meet.svg", width: 139, height: 77 },
  plan: { src: "/process/plan.svg", width: 66, height: 62 },
  web: { src: "/process/web.svg", width: 94, height: 64 },
  testing: { src: "/process/testing.svg", width: 94, height: 48 },
  launch: { src: "/process/launch.svg", width: 81, height: 107 },
  aside: { src: "/process/aside.svg", width: 195, height: 103 },
  polygon: "/process/polygon.svg",
};

const ARROWS = {
  top: { src: "/process/arrow-top.svg", width: 134, height: 45 },
  down1: { src: "/process/arrow-down-1.svg", width: 187, height: 89 },
  down2: { src: "/process/arrow-down-2.svg", width: 97, height: 86 },
  bottom1: { src: "/process/arrow-bottom-1.svg", width: 185, height: 41 },
  bottom2: { src: "/process/arrow-bottom-2.svg", width: 89, height: 90 },
};

type IconAsset = { src: string; width: number; height: number };

const Step = ({
  icon,
  title,
  desc,
  align = "left",
}: {
  icon: IconAsset;
  title: string;
  desc: string;
  align?: "left" | "right";
}) => (
  <div
    className={`group flex items-start gap-5 md:gap-6 max-w-sm ${
      align === "right" ? "md:flex-row-reverse md:text-right" : ""
    }`}
  >
    <Image
      src={icon.src}
      width={icon.width}
      height={icon.height}
      alt=""
      aria-hidden="true"
      className="h-14 md:h-20 w-auto shrink-0 transition-transform duration-500 group-hover:scale-105"
      unoptimized
    />
    <div>
      <h3 className="text-lg md:text-2xl font-black uppercase tracking-tighter text-brand-text mb-3 transition-colors duration-500 group-hover:text-brand-accent">
        {title}
      </h3>
      <p className="text-sm md:text-base leading-relaxed font-light text-brand-muted">
        {desc}
      </p>
    </div>
  </div>
);

const Arrow = ({
  icon,
  className = "",
}: {
  icon: IconAsset;
  className?: string;
}) => (
  <Image
    src={icon.src}
    width={icon.width}
    height={icon.height}
    alt=""
    aria-hidden="true"
    className={`h-8 md:h-10 w-auto opacity-80 ${className}`}
    unoptimized
  />
);

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const t = useTranslations("about.process");

  const reveal = (i: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { delay: i * 0.1, duration: 0.6 },
  });

  return (
    <section
      ref={ref}
      className="lg:pl-16 border-t border-brand-border bg-brand-primary py-10 md:py-16 relative overflow-hidden"
    >
      <Image
        src={ICONS.polygon}
        alt=""
        width={1000}
        height={600}
        aria-hidden
        className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[1000px] opacity-[0.06]"
        unoptimized
      />

      <Container className="relative">
        {/* Heading */}
        <div className="text-center mb-16 md:mb-24">
          <p className="text-brand-accent text-[11px] md:text-xs uppercase tracking-wide mb-6 font-mono font-bold flex items-center justify-center gap-2">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter text-brand-text">
            {t.rich("title", {
              accent: (chunks) => (
                <span className="text-brand-accent italic font-serif font-light lowercase">
                  {chunks}
                </span>
              ),
            })}
          </h2>
          <p className="text-brand-muted text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto mt-6">
            {t("intro")}
          </p>
        </div>

        {/* TOP ROW — Audit → Conception */}
        <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-10">
          <motion.div {...reveal(0)} className="md:justify-self-start">
            <Step
              icon={ICONS.meet}
              title={t("steps.audit.title")}
              desc={t("steps.audit.desc")}
            />
          </motion.div>
          <Arrow icon={ARROWS.top} className="hidden md:block mx-auto" />
          <motion.div {...reveal(1)} className="md:justify-self-end">
            <Step
              icon={ICONS.plan}
              title={t("steps.design.title")}
              desc={t("steps.design.desc")}
              align="right"
            />
          </motion.div>
        </div>

        {/* Connector down to middle */}
        <Arrow
          icon={ARROWS.down1}
          className="hidden md:block mx-auto my-8 md:my-12"
        />

        {/* MIDDLE — Développement (centered) */}
        <div className="flex justify-center mt-10 md:mt-0">
          <motion.div {...reveal(2)} className="max-w-md text-center">
            <Step
              icon={ICONS.web}
              title={t("steps.build.title")}
              desc={t("steps.build.desc")}
            />
          </motion.div>
        </div>

        {/* Connector down to bottom */}
        <Arrow
          icon={ARROWS.down2}
          className="hidden md:block mx-auto my-8 md:my-12"
        />

        {/* BOTTOM ROW — Tests → Déploiement */}
        <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-10 mt-10 md:mt-0">
          <motion.div {...reveal(3)} className="md:justify-self-start">
            <Step
              icon={ICONS.testing}
              title={t("steps.test.title")}
              desc={t("steps.test.desc")}
            />
          </motion.div>
          <div className="hidden md:flex items-center gap-1">
            <Arrow icon={ARROWS.bottom1} />
            <Arrow icon={ARROWS.bottom2} />
          </div>
          <motion.div {...reveal(4)} className="md:justify-self-end">
            <Step
              icon={ICONS.launch}
              title={t("steps.deliver.title")}
              desc={t("steps.deliver.desc")}
              align="right"
            />
          </motion.div>
        </div>

        {/* ASIDE */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 md:mt-24 mx-auto max-w-md border border-brand-border rounded-2xl bg-brand-surface p-8 flex flex-col items-center text-center gap-5"
        >
          <Image
            src={ICONS.aside.src}
            width={ICONS.aside.width}
            height={ICONS.aside.height}
            alt=""
            aria-hidden="true"
            className="h-16 md:h-24 w-auto"
            unoptimized
          />
          <div>
            <p className="text-brand-muted font-light mb-3">{t("footnote")}</p>
            <Link
              href="/services"
              className="text-brand-accent font-bold uppercase tracking-wide text-xs hover:underline underline-offset-4 inline-flex items-center min-h-11 py-3"
            >
              {t("footnoteCta")}
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
