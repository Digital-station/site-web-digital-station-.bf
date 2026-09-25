"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { AlertCircle, ArrowRight, Mail, Send } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SERVICES } from "@/content/services";
import { SOLUTIONS } from "@/content/solutions";
import { FAQ_KEYS } from "@/content/faq";
import {
  buildLeadSchema,
  LEAD_LIMITS,
  type LeadInput,
} from "@/lib/lead-schema";
import { mailHref, waHref } from "@/config/site.config";
import { trackEvent } from "@/lib/analytics";
import { WhatsAppIcon } from "@/components/ui/icons/WhatsApp";

const BUDGET_KEYS = ["low", "mid", "high"] as const;

/**
 * `aria-describedby` takes a space-separated *id list*, not a class list. This
 * used to go through `cn()`, which only happened to work because none of the
 * ids looked like a Tailwind utility to `twMerge` — a future id such as
 * `contact-hint-sm` could have been silently dropped as a conflicting class.
 */
const describedBy = (...ids: (string | false | undefined)[]) =>
  ids.filter(Boolean).join(" ") || undefined;

type SubmitState = "idle" | "sending" | "sent" | "error";

/**
 * `useSearchParams()` opts the whole subtree into client-side rendering, so
 * Next requires it to sit under a Suspense boundary. The boundary is here
 * rather than in the page (which this task does not own).
 */
export function ContactForm() {
  return (
    // MotionConfig lives on each motion subtree (not the layout): importing
    // it globally would drag the whole Motion barrel into every page's
    // initial bundle. See providers/MotionProvider.tsx.
    <MotionProvider>
      <Suspense fallback={<FormShell />}>
        <ContactFormInner />
      </Suspense>
    </MotionProvider>
  );
}

function FormShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="form-reveal bg-brand-surface border border-brand-border p-8 md:p-12 rounded-[2rem] relative overflow-hidden  min-h-[640px]">
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl -z-10"
      />
      {children}
    </div>
  );
}

function ContactFormInner() {
  const t = useTranslations("contact.form");
  const tf = useTranslations("contact.faq");
  const tm = useTranslations("contact.meta");
  const tc = useTranslations("common");
  const tsvc = useTranslations("services.items");
  const tsol = useTranslations("solutions.items");
  const searchParams = useSearchParams();
  // Motion's own hook (not @/lib/use-reduced-motion): `initial` is read once at
  // mount, so the value has to be right synchronously on the first render.
  const reduced = useReducedMotion();

  /**
   * Service options are derived from SERVICES rather than kept as a separate
   * list. The Vite build hardcoded ten different options here — they included
   * "Data & Analytics", which is not a service Digital Station offers, and
   * omitted several that are. Deriving them means the dropdown can never drift
   * from the catalogue again.
   */
  const objectiveOptions = useMemo(
    () => [
      ...SERVICES.map((s) => tsvc(`${s.slug}.title`)),
      t("objectives.other"),
    ],
    [tsvc, t],
  );

  const [state, setState] = useState<SubmitState>("idle");
  const [showFAQ, setShowFAQ] = useState(false);

  /**
   * One schema, shared with `/api/leads` — the Vite build kept two that
   * silently disagreed on limits. Messages are localized here; the server
   * builds the same shape with generic strings.
   */
  const schema = useMemo(
    () =>
      buildLeadSchema({
        name: t("errors.name"),
        email: t("errors.email"),
        phone: t("errors.phone"),
        contactRequired: t("errors.contactRequired"),
        brief: t("errors.brief"),
        tooLong: t("errors.tooLong"),
      }),
    [t],
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    setFocus,
  } = useForm<LeadInput>({ resolver: zodResolver(schema) });

  /**
   * Focus follows the form's state, so a keyboard or screen-reader user is
   * never left on a button that just disappeared: the success heading when the
   * message is sent, the name field again after "send another".
   */
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const refocusNameRef = useRef(false);

  useEffect(() => {
    if (state === "sent") {
      successHeadingRef.current?.focus();
    } else if (state === "idle" && refocusNameRef.current) {
      refocusNameRef.current = false;
      setFocus("name");
    }
  }, [state, setFocus]);

  /**
   * The selected budget band lives in the form state only. It used to be held
   * twice — a `useState` copy *and* `setValue('budget', …)` — and the POST body
   * then spread `{ ...data, budget }`, so the state copy silently won. One
   * source now; `reset()` clears the chips along with everything else.
   */
  const budget = useWatch({ control, name: "budget" }) ?? "";

  /**
   * `/contact?product=<solution-slug>` — arriving from a "Demander une démo"
   * button on /solutions. Preselects software development as the objective and
   * seeds the brief with the product name, so the visitor starts from a
   * sentence instead of a blank box.
   */
  const product = searchParams.get("product");

  useEffect(() => {
    if (!product) return;
    const solution = SOLUTIONS.find((s) => s.id === product);
    if (!solution) return;

    setValue("objective", tsvc("software-development.title"));
    if (!getValues("brief")) {
      setValue(
        "brief",
        t("demoBrief", { product: tsol(`${solution.id}.name`) }),
      );
    }
  }, [product, setValue, getValues, t, tsvc, tsol]);

  const onSubmit = async (data: LeadInput) => {
    if (state === "sending") return;
    setState("sending");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // The old build showed the success screen regardless of the response.
        setState("error");
        return;
      }

      setState("sent");
      reset();

      /**
       * Fires only if an analytics provider is configured; otherwise a no-op.
       * The provider-specific guard lives in lib/analytics.ts rather than
       * being open-coded here, so call sites cannot forget it.
       */
      trackEvent("contact_form_submitted", {
        service: data.objective || "unspecified",
        budget: data.budget || "unspecified",
      });
    } catch (error) {
      console.error("Submission failed", error);
      setState("error");
    }
  };

  /* No `outline-none`: the global :focus-visible ring is the focus indicator.
     The light-theme reds are darker because red-500 is 3.8:1 on cream. */
  const fieldClass = (hasError: boolean) =>
    cn(
      "w-full bg-brand-primary/50 border border-brand-field rounded-xl px-5 py-3.5 md:px-6 md:py-4 transition-all placeholder:text-brand-muted focus:border-brand-accent",
      hasError && "border-red-500/60 focus:border-red-500 light:border-red-700",
    );

  const labelClass =
    "text-[11px] md:text-xs uppercase tracking-wide font-black text-brand-muted ml-4";

  /**
   * Fallbacks for the "the send failed, here are two other ways" panel.
   * Built from whatever the visitor already typed, so nothing is retyped.
   */
  const retryText = () => {
    const v = getValues();
    return [v.name, v.brief].filter(Boolean).join(" — ");
  };

  const retryMailHref = () => {
    const v = getValues();
    const subject = `${tm("title")}${v.name ? ` — ${v.name}` : ""}`;
    const body = [v.name, v.email, v.phone, v.objective, v.budget, v.brief]
      .filter(Boolean)
      .join("\n");
    return `${mailHref(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <FormShell>
      {state === "sent" ? (
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="h-full flex flex-col items-center justify-center text-center py-16 md:py-20"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-accent-strong rounded-full flex items-center justify-center mb-6">
            <Send className="text-brand-on-accent w-8 h-8 md:w-10 md:h-10" />
          </div>
          {/* Focused on arrival (see the effect above), which is what gets it
              read out; a live region on top would announce it twice. */}
          <h2
            ref={successHeadingRef}
            tabIndex={-1}
            className="text-3xl md:text-4xl font-black uppercase mb-4 text-balance outline-none"
          >
            {t("successTitle")}
          </h2>
          <p className="text-brand-muted text-sm mb-2">{t("successBody")}</p>
          <p className="text-brand-muted text-xs mb-8">{t("successSpam")}</p>
          <button
            type="button"
            onClick={() => {
              refocusNameRef.current = true;
              setState("idle");
            }}
            className="mt-4 text-brand-accent font-bold uppercase tracking-wide text-[11px] md:text-xs border-b-2 border-brand-accent pb-1 hover:text-brand-text hover:border-brand-text transition-colors min-h-11 px-2"
          >
            {t("sendAnother")}
          </button>
        </motion.div>
      ) : (
        <>
          <h2 className="sr-only">{t("submit")}</h2>

          {/* FAQ */}
          <div className="mb-8 bg-brand-primary/30 rounded-2xl p-5 border border-brand-border">
            <button
              type="button"
              onClick={() => setShowFAQ((v) => !v)}
              aria-expanded={showFAQ}
              aria-controls="contact-faq-panel"
              className="flex items-center justify-between w-full text-left group min-h-11"
            >
              <span className="text-xs font-bold uppercase tracking-wider">
                {tf("title")}
              </span>
              <ArrowRight
                className={cn(
                  "w-4 h-4 transition-transform text-brand-accent",
                  showFAQ && "rotate-90",
                )}
              />
            </button>

            <AnimatePresence>
              {showFAQ && (
                <motion.div
                  id="contact-faq-panel"
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 mt-5 pt-5 border-t border-brand-border">
                    {FAQ_KEYS.map((key) => (
                      <div
                        key={key}
                        className="border-l-2 border-brand-accent/30 pl-4 hover:border-brand-accent transition-colors"
                      >
                        <p className="text-xs font-bold text-brand-accent mb-1.5">
                          {tf(`items.${key}.q`)}
                        </p>
                        <p className="text-xs text-brand-muted leading-relaxed">
                          {tf(`items.${key}.a`)}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 md:space-y-8"
          >
            {/* Honeypot — hidden from people, irresistible to bots. */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                tabIndex={-1}
                autoComplete="off"
                {...register("company")}
              />
            </div>

            {/*
              ONE name field, not first + last. Splitting a name into two
              required boxes is a Western convention the visitor has to
              humour; the lead only ever needed something to greet them by.
            */}
            <div className="space-y-2">
              <label htmlFor="name" className={labelClass}>
                {t("name")} <RequiredMark />
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                maxLength={LEAD_LIMITS.name}
                placeholder={t("namePlaceholder")}
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={fieldClass(!!errors.name)}
                {...register("name")}
              />
              {errors.name && (
                <FieldError id="name-error" message={errors.name.message} />
              )}
            </div>

            {/*
              Email and phone are BOTH optional — the schema only requires one
              of the two. In Burkina Faso a phone number is often the address
              someone actually has; demanding an email lost those leads.
            */}
            <div className="space-y-2">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-2">
                  <label htmlFor="email" className={labelClass}>
                    {t("email")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    maxLength={LEAD_LIMITS.email}
                    placeholder={t("emailPlaceholder")}
                    aria-invalid={!!errors.email}
                    aria-describedby={describedBy(
                      errors.email && "email-error",
                      "contact-hint",
                    )}
                    className={fieldClass(!!errors.email)}
                    {...register("email")}
                  />
                  {errors.email && (
                    <FieldError
                      id="email-error"
                      message={errors.email.message}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className={labelClass}>
                    {t("phone")}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={LEAD_LIMITS.phone}
                    placeholder={t("phonePlaceholder")}
                    aria-invalid={!!errors.phone}
                    aria-describedby={describedBy(
                      errors.phone && "phone-error",
                      "contact-hint",
                    )}
                    className={fieldClass(!!errors.phone)}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <FieldError
                      id="phone-error"
                      message={errors.phone.message}
                    />
                  )}
                </div>
              </div>

              <p
                id="contact-hint"
                className="text-[11px] md:text-xs text-brand-muted ml-4"
              >
                {t("contactHint")}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="objective" className={labelClass}>
                {t("objective")}
              </label>
              <div className="relative">
                <select
                  id="objective"
                  className={cn(
                    fieldClass(false),
                    "appearance-none cursor-pointer",
                  )}
                  {...register("objective")}
                >
                  <option value="">{t("objectivePlaceholder")}</option>
                  {objectiveOptions.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <span id="budget-label" className={labelClass}>
                {t("budget")}
              </span>
              <div
                role="group"
                aria-labelledby="budget-label"
                className="grid grid-cols-3 gap-3"
              >
                {BUDGET_KEYS.map((key) => {
                  const label = t(`budgets.${key}`);
                  const selected = budget === label;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setValue("budget", label)}
                      className={cn(
                        "min-h-11 py-3 rounded-xl border-2 transition-all text-xs font-bold uppercase tracking-wide",
                        selected
                          ? "border-brand-accent bg-brand-accent-soft text-brand-accent scale-105"
                          : "border-brand-border text-brand-muted hover:border-brand-accent/50 hover:text-brand-text",
                      )}
                    >
                      {label}{" "}
                      <span className="text-[11px]">{t("currency")}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="brief" className={labelClass}>
                {t("brief")} <RequiredMark />
              </label>
              <textarea
                id="brief"
                rows={5}
                maxLength={LEAD_LIMITS.brief}
                placeholder={t("briefPlaceholder")}
                aria-required="true"
                aria-invalid={!!errors.brief}
                aria-describedby={errors.brief ? "brief-error" : undefined}
                className={cn(fieldClass(!!errors.brief), "resize-none")}
                {...register("brief")}
              />
              {errors.brief && (
                <FieldError id="brief-error" message={errors.brief.message} />
              )}
            </div>

            {/*
              A failed send used to be a dead end: one red line and a plain-text
              email address to copy by hand. Now the two channels that always
              work are one tap away, prefilled with what was already typed.
            */}
            {state === "error" && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-4 space-y-4"
              >
                <p className="flex items-start gap-2 text-xs text-red-400 light:text-red-700">
                  <AlertCircle
                    aria-hidden="true"
                    className="w-4 h-4 shrink-0 mt-px"
                  />
                  {t("errors.submit")}
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={waHref(retryText())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline inline-flex items-center gap-2 px-5 py-3 text-xs"
                  >
                    <WhatsAppIcon size={18} className="text-green-500" />
                    {t("retryWhatsapp")}
                  </a>
                  <a
                    href={retryMailHref()}
                    className="btn-outline inline-flex items-center gap-2 px-5 py-3 text-xs"
                  >
                    <Mail className="w-4 h-4" />
                    {t("retryEmail")}
                  </a>
                </div>
              </div>
            )}

            {/* Always in the DOM, so screen readers are already watching it
                when "Envoi…" appears. */}
            <p role="status" className="sr-only">
              {state === "sending" ? t("sending") : ""}
            </p>

            <motion.button
              type="submit"
              aria-disabled={state === "sending"}
              whileHover={{ scale: state === "sending" ? 1 : 1.02 }}
              whileTap={{ scale: state === "sending" ? 1 : 0.98 }}
              className={cn(
                "btn-primary w-full py-5 flex items-center justify-center gap-3 text-base md:text-lg uppercase font-black",
                state === "sending" && "opacity-70 pointer-events-none",
              )}
            >
              {state === "sending" ? t("sending") : t("submit")}
              {state !== "sending" && <Send className="w-5 h-5" />}
            </motion.button>

            {/* The promise sits directly under the button, where it answers
                "and then what happens?" at the moment of clicking. */}
            <p className="text-center text-xs md:text-sm text-brand-muted">
              {tc("promise")}
            </p>
            <p className="text-center text-xs text-brand-muted">
              {t("privacyNote")}
            </p>
          </form>
        </>
      )}
    </FormShell>
  );
}

/**
 * No `role="alert"`: an empty submit used to fire one alert per field, all at
 * once. react-hook-form focuses the first invalid field instead, and each
 * field's `aria-describedby` points here, so its error is read with it.
 */
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="text-red-500 light:text-red-700 text-[11px] md:text-xs font-bold uppercase tracking-wide ml-4 flex items-center gap-1"
    >
      <AlertCircle aria-hidden="true" className="w-3 h-3 shrink-0" />
      {message}
    </p>
  );
}

/** Visual only: the field itself carries `aria-required`. */
function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-red-500 light:text-red-700">
      *
    </span>
  );
}
