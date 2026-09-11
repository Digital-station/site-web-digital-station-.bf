import { useTranslations } from "next-intl";

import type { Tool } from "./tools-data";

/**
 * One logo chip.
 *
 * Deliberately a plain `<img>`, not next/image: these sit inside a
 * transform-animated marquee that renders 3+ duplicated copies of every row,
 * so next/image's layout wrappers and srcset machinery add cost with no
 * benefit at this fixed render size. The intrinsic `width`/`height` are
 * declared so the browser reserves the box before the file arrives.
 *
 * The chip is theme-aware — `bg-brand-surface` + a `ring-brand-border`
 * hairline — rather than a hardcoded white card, which read as a bright slab
 * on the cream light-mode background.
 */
export function ToolCard({ name, src }: Tool) {
  const t = useTranslations("home.tools");

  return (
    <div className="mx-3 inline-flex shrink-0 items-center gap-3 rounded-2xl bg-brand-surface px-5 py-4  transition-transform duration-300 hover:scale-150">
      <img
        src={src}
        alt={t("logoAlt", { name })}
        width={192}
        height={96}
        loading="lazy"
        decoding="async"
        className="h-24 w-48 object-contain"
      />
    </div>
  );
}
