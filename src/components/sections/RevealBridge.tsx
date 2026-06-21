"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";

/**
 * The "gap" between the two reveal bands — a clever, attention-catching line
 * aimed at the prospective student, set on the light website background so the
 * two cinematic strips feel deliberately separated.
 */
export default function RevealBridge() {
  const t = useTranslations("bridge");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <section className="relative overflow-hidden bg-ivory px-6 py-20 md:py-28">
      {/* ambient depth */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(155,111,232,0.14),transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 dot-grid opacity-[0.04]" />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.9, ease: EASE_LUXURY }}
        className="relative z-10 mx-auto max-w-3xl"
      >
        <div className="relative rounded-[2rem] p-px bg-gradient-to-br from-lav-300/70 via-white/40 to-gold-300/60 shadow-[0_30px_80px_-30px_rgba(46,31,82,0.28)]">
          <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-white/80 backdrop-blur-sm px-7 py-12 md:px-14 md:py-16 text-center">
            {/* oversized decorative quote mark */}
            <span
              className="font-display pointer-events-none absolute -top-2 left-6 text-[7rem] leading-none text-gold-300/30 select-none"
              aria-hidden
            >
              &ldquo;
            </span>

            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="w-8 h-px bg-gold-400/70" />
              <span className="text-eyebrow text-lav-600">{t("eyebrow")}</span>
              <span className="w-8 h-px bg-gold-400/70" />
            </div>

            <h2 className="font-display font-light tracking-tight leading-[1.12]">
              <motion.span
                initial={{ opacity: 0, y: 22 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.85, delay: 0.12, ease: EASE_LUXURY }}
                className="block text-plum text-[clamp(1.7rem,4.2vw,3rem)]"
              >
                {t("line1")}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 22 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.85, delay: 0.26, ease: EASE_LUXURY }}
                className="block text-gradient text-[clamp(1.7rem,4.2vw,3rem)]"
              >
                {t("line2")}
              </motion.span>
            </h2>

            <motion.span
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.4, ease: EASE_LUXURY }}
              className="mt-8 block h-px w-24 mx-auto origin-center bg-gradient-to-r from-transparent via-gold-400 to-transparent"
              aria-hidden
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
