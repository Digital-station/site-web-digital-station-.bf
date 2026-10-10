import Image from "next/image";
import { useTranslations } from "next-intl";

import type { Tool } from "./tools-data";

/**
 * One logo chip.
 *
 * Theme-aware chip with optimized WebP/SVG rendering.
 */
export function ToolCard({ name, src }: Tool) {
  const t = useTranslations("home.tools");

  return (
    <div className="mx-3 inline-flex shrink-0 items-center gap-3 rounded-2xl bg-brand-surface px-5 py-4 transition-transform duration-300 motion-safe:hover:scale-150">
      <Image
        src={src}
        alt={t("logoAlt", { name })}
        width={192}
        height={96}
        className="h-24 w-48 object-contain"
        unoptimized
      />
    </div>
  );
}
