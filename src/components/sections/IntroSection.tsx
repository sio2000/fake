"use client";
import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import PremiumButton from "@/components/ui/PremiumButton";
import { EASE_LUXURY } from "@/lib/motion";

type IntroCard = { tag: string; title: string; desc: string };

const ICONS: ReactNode[] = [
  <g key="who">
    <circle cx="12" cy="8" r="3.4" />
    <path d="M5.5 19.5c0-3.7 2.9-5.6 6.5-5.6s6.5 1.9 6.5 5.6" />
  </g>,
  <g key="problem">
    <rect x="5" y="11" width="14" height="9" rx="2.2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </g>,
  <g key="how">
    <rect x="5" y="11" width="14" height="9" rx="2.2" />
    <path d="M8 11V8a4 4 0 0 1 7.4-1.9" />
  </g>,
];

const CARD_THEMES = [
  {
    frame: "from-lav-300/80 via-lav-100/40 to-white/60",
    glow: "bg-lav-300/25",
    icon: "from-lav-100 to-lav-200/80 text-lav-700 ring-lav-200/80",
    accent: "from-lav-500 via-lav-400 to-lav-300",
    hover: "group-hover:shadow-[0_20px_50px_-12px_rgba(155,111,232,0.28)]",
  },
  {
    frame: "from-plum/20 via-lav-100/30 to-white/60",
    glow: "bg-plum/10",
    icon: "from-lav-50 to-lav-100 text-plum ring-lav-200/70",
    accent: "from-plum-soft via-lav-500 to-lav-400",
    hover: "group-hover:shadow-[0_20px_50px_-12px_rgba(82,64,128,0.22)]",
  },
  {
    frame: "from-gold-300/90 via-gold-200/50 to-white/70",
    glow: "bg-gold-300/30",
    icon: "from-gold-200/80 to-gold-200/40 text-gold-500 ring-gold-300/60",
    accent: "from-gold-500 via-gold-400 to-lav-400",
    hover: "group-hover:shadow-gold-glow",
  },
];

export default function IntroSection() {
  const t = useTranslations("intro");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const cards = t.raw("cards") as IntroCard[];

  return (
    <section className="relative py-20 md:py-28 px-6 overflow-hidden bg-[#f6f1ff]">
      <div className="absolute inset-x-0 top-0 h-2 bg-black/5" />
      <div className="absolute left-0 top-16 h-24 w-24 rounded-br-[3rem] bg-[#5f3fc0]/10" />
      <div className="absolute right-0 bottom-24 h-28 w-28 rounded-tl-[3rem] bg-[#f5dd79]/15" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 left-1/4 h-32 w-32 rounded-full bg-[#5f3fc0]/10 blur-2xl" />
        <div className="absolute bottom-10 right-10 h-24 w-24 rounded-full bg-[#f5dd79]/15 blur-2xl" />
      </div>

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE_LUXURY }}
          className="flex items-center justify-center gap-3 mb-7"
        >
          <span className="w-8 h-px bg-gold-400/70" />
          <span className="text-eyebrow text-lav-600">{t("eyebrow")}</span>
          <span className="w-8 h-px bg-gold-400/70" />
        </motion.div>

        <div className="text-center max-w-3xl mx-auto">
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "110%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: EASE_LUXURY }}
              className="text-display-xl text-plum text-[clamp(1.9rem,4.6vw,3.1rem)]"
            >
              {t("headline1")}
            </motion.h2>
          </div>
          <div className="overflow-hidden pb-1">
            <motion.h2
              initial={{ y: "110%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: EASE_LUXURY }}
              className="text-display-xl text-gradient text-[clamp(1.9rem,4.6vw,3.1rem)]"
            >
              {t("headline2")}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.4, ease: EASE_LUXURY }}
            className="text-body-premium text-lg md:text-xl mt-7 max-w-2xl mx-auto"
          >
            {t("lead")}
          </motion.p>
        </div>

        <div className="relative mt-14 md:mt-16">
          <div className="absolute inset-x-0 top-10 h-px bg-black/10" aria-hidden />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
            {cards.map((card, i) => {
              const theme = CARD_THEMES[i % CARD_THEMES.length];
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 36 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.5 + i * 0.14, ease: EASE_LUXURY }}
                  whileHover={{ y: -10 }}
                  className={`group relative rounded-[1.75rem] border-4 border-black/10 p-[1px] bg-gradient-to-br ${theme.frame} shadow-[0_28px_90px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_34px_120px_rgba(0,0,0,0.12)]`}
                >
                  <article className="relative h-full overflow-hidden rounded-[calc(1.75rem-1px)] bg-[#f7f2ff] px-8 pt-9 pb-10 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]">
                    <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-[2rem] border-b-4 border-l-4 border-black/10 bg-black/5" aria-hidden />
                    <span
                      className={`pointer-events-none absolute -top-10 -right-8 h-40 w-40 rounded-full blur-[42px] opacity-65 ${theme.glow}`}
                      aria-hidden
                    />
                    <span
                      className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${theme.accent} opacity-95`}
                      aria-hidden
                    />

                    <div className="relative flex items-center justify-between gap-4 mb-6">
                      <span
                        className={`inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.2rem] bg-white border-4 border-black/10 ${theme.icon} shadow-[0_15px_30px_rgba(0,0,0,0.08)]`}
                        aria-hidden
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {ICONS[i % ICONS.length]}
                        </svg>
                      </span>
                      <span className="method-num font-display text-[3.8rem] font-semibold leading-none tracking-tight text-black/80" aria-hidden>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="mb-4">
                      <span className="inline-flex rounded-full bg-black text-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
                        {card.tag}
                      </span>
                    </div>
                    <h3 className="font-display text-[1.85rem] md:text-[2rem] text-black leading-[1.05] mb-4 tracking-tight">
                      {card.title}
                    </h3>
                    <p className="text-[15px] leading-8 text-black/75">{card.desc}</p>

                  </article>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.95, ease: EASE_LUXURY }}
          className="mt-12 flex justify-center"
        >
          <PremiumButton href={`/${locale}/contact`} variant="gold" size="lg" className="rounded-full px-7">
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
        </motion.div>
      </div>
    </section>
  );
}
