"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";

/** Lightweight count-up for the philosophy stats. */
function CountUp({ value, run, delay }: { value: string; run: boolean; delay: number }) {
  const reduce = useReducedMotion();
  const match = value.match(/^([\d.,]+)(.*)$/);
  const target = match ? parseInt(match[1].replace(/[^\d]/g, ""), 10) : NaN;
  const suffix = match ? match[2] : "";
  const ok = !reduce && !Number.isNaN(target);
  const [display, setDisplay] = useState(() => (ok ? "0" : value));

  useEffect(() => {
    if (!ok || !run) return;
    const fmt = (v: number) => Math.round(v).toLocaleString("el-GR") + suffix;
    const duration = 1700;
    const delayMs = delay * 1000;
    let raf = 0;
    let start = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const e = ts - start - delayMs;
      if (e < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(e / duration, 1);
      setDisplay(fmt((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(fmt(target));
    };
    raf = requestAnimationFrame(tick);
    const fb = setTimeout(() => setDisplay(fmt(target)), delayMs + duration + 250);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fb);
    };
  }, [ok, run, target, suffix, delay]);

  return <span className="tabular-nums">{display}</span>;
}

export default function PhilosophySection() {
  const t = useTranslations("philosophy");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const sRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  const stats = [
    { v: t("stat1Value"), l: t("stat1Label") },
    { v: t("stat2Value"), l: t("stat2Label") },
    { v: t("stat3Value"), l: t("stat3Label") },
  ];

  return (
    <section ref={sRef} className="relative py-20 md:py-28 overflow-hidden bg-warm-mesh">
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-48 -right-32 w-[600px] h-[600px] rounded-full bg-lav-300/25 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-gold-300/20 blur-3xl" />
        <div className="absolute inset-0 dot-grid opacity-[0.04]" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="rule-ornament mb-8 w-fit"
            >
              {t("label")}
            </motion.div>

            <h2 className="font-display font-light leading-[1.03] tracking-tight">
              <motion.span
                initial={{ y: 70, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.1, ease: EASE_LUXURY }}
                className="block text-plum text-4xl md:text-5xl lg:text-6xl"
              >
                {t("headline")}
              </motion.span>
              <motion.span
                initial={{ y: 70, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.18, ease: EASE_LUXURY }}
                className="block text-gradient text-4xl md:text-5xl lg:text-6xl"
              >
                {t("headline2")}
              </motion.span>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-8 text-plum/60 text-lg leading-relaxed max-w-md"
            >
              {t("body")}
            </motion.p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-5">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: EASE_LUXURY }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-[1.6rem] border border-lav-200/60 bg-white/80 backdrop-blur-sm p-7 shadow-soft transition-shadow duration-400 hover:shadow-[0_24px_60px_-20px_rgba(155,111,232,0.4)]"
              >
                <span
                  className="pointer-events-none absolute -top-10 -right-8 h-32 w-32 rounded-full bg-gold-300/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-lav-500 via-lav-400 to-gold-400 transition-transform duration-500 ease-out group-hover:scale-x-100"
                  aria-hidden
                />
                <div className="flex items-center gap-5">
                  <div className="font-display text-5xl md:text-6xl text-gradient font-light leading-none">
                    <CountUp value={s.v} run={inView} delay={0.2 + i * 0.12} />
                  </div>
                  <div className="flex-1 text-sm text-plum/55 leading-snug border-l border-lav-200 pl-5">
                    {s.l}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
