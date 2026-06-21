"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";

type SkillItem = { title: string; detail: string };

export default function CommunicationSection() {
  const t = useTranslations("communication");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const [expanded, setExpanded] = useState<number | null>(0);
  const skills = t.raw("skills") as SkillItem[];

  const handleClick = (index: number) => {
    setExpanded((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden bg-[linear-gradient(165deg,#241248_0%,var(--color-plum)_50%,#1c1138_100%)]">
      {/* depth + glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 left-[10%] h-[30rem] w-[30rem] rounded-full bg-lav-600/22 blur-[130px]" />
        <div className="absolute -bottom-32 right-[8%] h-[28rem] w-[28rem] rounded-full bg-gold-400/12 blur-[130px]" />
        <div className="absolute inset-0 dot-grid opacity-[0.05] mix-blend-overlay" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lav-400/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: message */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              className="inline-flex items-center gap-2.5 mb-7"
            >
              <span className="w-7 h-px bg-gold-400/80" />
              <span className="text-[11px] font-bold text-gold-300 tracking-[0.24em] uppercase">
                {t("label")}
              </span>
            </motion.div>

            <h2 className="font-display font-light leading-[1.04] tracking-tight">
              <motion.span
                initial={{ y: 60, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
                className="block text-white text-[clamp(2.1rem,5vw,3.6rem)]"
              >
                {t("headline")}
              </motion.span>
              <motion.span
                initial={{ y: 60, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.2, ease: EASE_LUXURY }}
                className="block text-gold text-[clamp(2.1rem,5vw,3.6rem)]"
              >
                {t("headline2")}
              </motion.span>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.34 }}
              className="mt-7 text-white/65 text-lg leading-relaxed max-w-md"
            >
              {t("body")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.44 }}
              className="relative mt-8 max-w-md rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6"
            >
              <span className="font-display absolute -top-3 left-4 text-6xl leading-none text-gold-300/40 select-none" aria-hidden>
                &ldquo;
              </span>
              <p className="relative font-display italic text-lav-100/90 text-lg md:text-xl leading-relaxed">
                {t("quote")}
              </p>
            </motion.div>
          </div>

          {/* Right: interactive skill stack */}
          <div className="flex flex-col gap-3">
            {skills.map((skill, i) => {
              const isOpen = expanded === i;
              return (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.07, ease: EASE_LUXURY }}
                  onClick={() => handleClick(i)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleClick(i);
                    }
                    if (e.key === "Escape") setExpanded(null);
                  }}
                  className={`group relative cursor-pointer select-none overflow-hidden rounded-2xl border transition-all duration-400 ${
                    isOpen
                      ? "border-gold-300/45 bg-white/[0.08] shadow-[0_24px_70px_rgba(8,4,24,0.5)]"
                      : "border-white/10 bg-white/[0.035] hover:border-lav-300/40 hover:bg-white/[0.06]"
                  }`}
                >
                  {/* gold sweep */}
                  <span
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-300/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                    aria-hidden
                  />
                  {/* left accent bar */}
                  <span
                    className={`pointer-events-none absolute left-0 top-0 h-full w-[3px] origin-top bg-gradient-to-b from-gold-400 to-lav-400 transition-transform duration-400 ${
                      isOpen ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                    }`}
                    aria-hidden
                  />
                  <div className="relative z-10 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display text-sm font-semibold transition-colors duration-300 ${
                            isOpen
                              ? "bg-gradient-to-br from-gold-300 to-gold-500 text-plum"
                              : "bg-white/10 text-lav-200 group-hover:bg-white/15"
                          }`}
                          aria-hidden
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`text-[15px] font-medium transition-colors duration-300 ${
                            isOpen ? "text-white" : "text-white/75 group-hover:text-white"
                          }`}
                        >
                          {skill.title}
                        </span>
                      </div>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gold-300/70 text-xs shrink-0"
                        aria-hidden
                      >
                        ▾
                      </motion.span>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE_LUXURY }}
                          className="overflow-hidden"
                        >
                          <p className="pt-4 pl-[3.1rem] text-white/60 text-sm leading-relaxed">
                            {skill.detail}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
