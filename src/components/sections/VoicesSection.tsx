"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import PremiumButton from "@/components/ui/PremiumButton";
import { EASE_LUXURY } from "@/lib/motion";

/**
 * Voices — the emotional "inner voice" moment.
 *
 * A dark, cinematic beat that surfaces the visitor's own unspoken objections
 * ("I'm afraid to speak", "I lose opportunities…") so they think *"this is
 * exactly how I feel"* — then resolves the tension with a single reframing
 * line and a CTA. Replaces the old ambient scattered-quote layer with one
 * focused, premium section that lands on every screen size.
 */

// Slight vertical scatter so the cards feel hand-placed, not gridded (lg+ only).
const SCATTER = ["lg:translate-y-0", "lg:translate-y-8", "lg:-translate-y-4"];

// Per-quote accent so the six "inner voices" feel individual, not templated.
const ACCENTS = [
  { mark: "text-lav-300/40", glow: "bg-lav-500/20", hover: "group-hover:border-lav-300/45", bar: "from-lav-400 to-lav-300" },
  { mark: "text-gold-300/40", glow: "bg-gold-400/16", hover: "group-hover:border-gold-300/45", bar: "from-gold-400 to-gold-300" },
  { mark: "text-lav-200/40", glow: "bg-lav-400/20", hover: "group-hover:border-lav-200/45", bar: "from-lav-300 to-gold-300" },
];

export default function VoicesSection() {
  const t = useTranslations("voices");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const quotes = t.raw("items") as string[];

  return (
    <section className="relative overflow-hidden py-24 md:py-32 px-6 bg-[linear-gradient(180deg,#1d1238_0%,var(--color-plum)_45%,#1a1035_100%)]">
      {/* depth + glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-24 left-1/4 h-[28rem] w-[28rem] rounded-full bg-lav-600/20 blur-[120px]" />
        <div className="absolute -bottom-24 right-1/5 h-[26rem] w-[26rem] rounded-full bg-gold-400/12 blur-[120px]" />
        <div className="absolute inset-0 dot-grid opacity-[0.05] mix-blend-overlay" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lav-400/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
      </div>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto">
        {/* heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE_LUXURY }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <span className="w-8 h-px bg-gold-400/70" />
            <span className="text-eyebrow text-gold-300">{t("eyebrow")}</span>
            <span className="w-8 h-px bg-gold-400/70" />
          </motion.div>

          <h2 className="font-display font-light tracking-tight leading-[1.08]">
            <motion.span
              initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
              className="block text-white/95 text-[clamp(1.9rem,4.6vw,3.4rem)]"
            >
              {t("headline1")}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.9, delay: 0.24, ease: EASE_LUXURY }}
              className="block text-gold text-[clamp(1.9rem,4.6vw,3.4rem)]"
            >
              {t("headline2")}
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.4, ease: EASE_LUXURY }}
            className="mt-6 text-white/65 text-base md:text-lg font-light leading-relaxed"
          >
            {t("lead")}
          </motion.p>
        </div>

        {/* quote cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {quotes.map((quote, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <motion.div
                key={quote}
                initial={{ opacity: 0, y: 34 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.09, ease: EASE_LUXURY }}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 280, damping: 18 } }}
                className={`group relative ${SCATTER[i % SCATTER.length]}`}
              >
                <div
                  className={`relative h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.06] backdrop-blur-xl px-7 pt-10 pb-7 shadow-[0_28px_80px_rgba(10,5,28,0.45)] transition-colors duration-300 group-hover:bg-white/[0.09] ${accent.hover}`}
                >
                  {/* per-card depth glow */}
                  <span
                    className={`pointer-events-none absolute -top-12 -right-10 h-36 w-36 rounded-full blur-[44px] opacity-70 ${accent.glow}`}
                    aria-hidden
                  />
                  {/* accent bar grows in on hover */}
                  <span
                    className={`pointer-events-none absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r ${accent.bar} transition-transform duration-500 ease-out group-hover:scale-x-100`}
                    aria-hidden
                  />
                  {/* light sweep on hover */}
                  <span
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                    aria-hidden
                  />
                  <span
                    className={`font-display absolute left-5 top-1 text-7xl leading-none select-none ${accent.mark}`}
                    aria-hidden
                  >
                    &ldquo;
                  </span>
                  <p className="relative font-display italic text-[1.3rem] md:text-[1.45rem] leading-snug text-white/90">
                    {quote}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* resolve */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 1.1, ease: EASE_LUXURY }}
          className="mt-16 md:mt-20 text-center max-w-2xl mx-auto"
        >
          <p className="font-display text-2xl md:text-3xl lg:text-4xl font-light leading-snug">
            <span className="text-white/80">{t("resolveLead")} </span>
            <span className="text-gold">{t("resolve1")}</span>
          </p>
          <p className="mt-5 text-white/65 text-base md:text-lg font-light leading-relaxed">
            {t("resolve2")}
          </p>
          <div className="mt-9 flex justify-center">
            <PremiumButton href={`/${locale}/contact`} variant="gold" size="lg" className="rounded-full px-8">
              {t("cta")}
              <motion.svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </motion.svg>
            </PremiumButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
