import {
  ThreeDScrollTriggerContainer,
  ThreeDScrollTriggerRow,
} from "../lib/ThreeDScrollTrigger";

/* ── DATA ──────────────────────────────────────────────────── */
/* Logos live in /public/logo and are served at /logo/<file>.   */
/* Split into two rows — opposite directions for the 3D effect. */

interface Tool {
  name: string;
  src: string;
}

const TOOLS_ROW_1: Tool[] = [
  { name: "React", src: "/logo/React.png" },
  { name: "TypeScript", src: "/logo/typescript.svg" },
  { name: "JavaScript", src: "/logo/javascript.png" },
  { name: "Go", src: "/logo/Go.svg" },
  { name: "Java", src: "/logo/Java.svg" },
  { name: "PHP", src: "/logo/PHP.svg" },
  { name: "C#", src: "/logo/C_Sharp.svg" },
  { name: "C++", src: "/logo/ISO_C++_Logo.svg" },
  { name: "Python", src: "/logo/Python.png" },
  { name: "Figma", src: "/logo/Figma.png" },
  { name: "Postman", src: "/logo/Postman.png" },
  { name: "Docker", src: "/logo/Docker.png" },
  { name: "GitLab", src: "/logo/Gitlab.png" },
  { name: "Npm", src: "/logo/Npm.svg" },
  { name: "pnpm", src: "/logo/pnpm.svg" },
  { name: "Yarn", src: "/logo/Yarn.svg" },
  { name: "Jest", src: "/logo/Jest.png" },
  { name: "Copilot", src: "/logo/Copilot.png" },
];

const TOOLS_ROW_2: Tool[] = [
  { name: "AWS", src: "/logo/Amazon-Web-Services.png" },
  { name: "Cloudflare", src: "/logo/Cloudflare.png" },
  { name: "Google", src: "/logo/Google.webp" },
  { name: "Google Ads", src: "/logo/Google_Ads.svg" },
  { name: "Meta", src: "/logo/Meta.png" },
  { name: "Shopify", src: "/logo/Shopify.svg" },
  { name: "WooCommerce", src: "/logo/WooCommerce.svg" },
  { name: "WordPress", src: "/logo/WordPress.png" },
  { name: "Drupal", src: "/logo/Drupal.png" },
  { name: "Joomla", src: "/logo/Joomla.png" },
  { name: "Odoo", src: "/logo/Odoo.webp" },
  { name: "Salesforce", src: "/logo/Salesforce.webp" },
  { name: "Oracle", src: "/logo/Oracle.png" },
  { name: "Microsoft", src: "/logo/Microsoft.svg" },
  { name: "Microsoft 365", src: "/logo/Microsoft-Office-365.png" },
  { name: "SharePoint", src: "/logo/SharePoint.png" },
  { name: "Zoom", src: "/logo/Zoom.png" },
  { name: "Slack", src: "/logo/slack.png" },
  { name: "Linux", src: "/logo/Linux.svg" },
  { name: "Ubuntu", src: "/logo/Ubuntu-Logo.jpg" },
  { name: "Nginx", src: "/logo/Nginx.jpg" },
];

/* ── CARD ──────────────────────────────────────────────────── */
/* White chip so every logo format (SVG / transparent PNG / JPG)
   stays legible on the dark section. */

const ToolCard = ({ name, src }: Tool) => (
  <div className="mx-3 inline-flex shrink-0 items-center gap-3 rounded-2xl bg-white px-5 py-4 ring-1 ring-black/5 shadow-[0_2px_24px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-105">
    <img
      src={src}
      alt={`${name} logo`}
      loading="lazy"
      className="h-24 w-24 object-contain"
    />
    <span className="text-sm font-semibold text-brand-primary whitespace-nowrap">
      {name}
    </span>
  </div>
);

/* ── SECTION ───────────────────────────────────────────────── */

export const ToolsWeMaster = () => {
  return (
    <section
      id="tools"
      className="lg:pl-16 border-t border-brand-border py-20 md:py-32 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Heading */}
        <div className="mb-14 md:mb-20 text-center">
          <p className="text-brand-accent text-[10px] md:text-xs uppercase tracking-[0.4em] mb-6 font-mono font-bold">
            Our Stack
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white">
            Tools{" "}
            <span className="text-brand-accent italic font-serif font-light lowercase">
              We Master
            </span>
          </h2>
          <p className="mt-6 text-neutral-500 text-sm md:text-base leading-relaxed font-light max-w-xl mx-auto">
            From low-level engineering to enterprise platforms — our team is
            fluent across the full spectrum of modern technologies.
          </p>
        </div>
      </div>

      {/* Velocity-reactive marquee — full-bleed within the left-rail gutter */}
      <div className="relative">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-32 bg-gradient-to-r from-brand-primary to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-32 bg-gradient-to-l from-brand-primary to-transparent" />

        <ThreeDScrollTriggerContainer>
          <ThreeDScrollTriggerRow
            direction={1}
            baseVelocity={3}
            className="mb-5 md:mb-8"
          >
            {TOOLS_ROW_1.map((t) => (
              <ToolCard key={t.name} {...t} />
            ))}
          </ThreeDScrollTriggerRow>

          <ThreeDScrollTriggerRow direction={-1} baseVelocity={3}>
            {TOOLS_ROW_2.map((t) => (
              <ToolCard key={t.name} {...t} />
            ))}
          </ThreeDScrollTriggerRow>
        </ThreeDScrollTriggerContainer>
      </div>
    </section>
  );
};
