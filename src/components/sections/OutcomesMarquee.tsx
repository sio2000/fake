"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";

/**
 * Outcomes marquee — a flowing, two-row band of the real-world English
 * contexts a student walks away able to own. Sits right under the hero to
 * answer "where will this change my life?" within the first scroll, turning
 * an abstract promise into concrete, aspirational situations.
 *
 * The words are English by design (it's an English academy) so they stay the
 * same across locales; only the small intro label is translated.
 */
const ROW_A = [
  "Job Interviews",
  "Executive Meetings",
  "Presentations",
  "Negotiations",
  "Public Speaking",
  "Networking",
];
const ROW_B = [
  "Leadership",
  "Pitches",
  "Conferences",
  "Daily Conversations",
  "Team Calls",
  "Travel & Life",
];

function Track({
  words,
  direction,
}: {
  words: string[];
  direction: "l" | "r";
}) {
  // Duplicate the list so the -50% translate loops seamlessly.
  const loop = [...words, ...words];
  return (
    <div className="marquee-mask overflow-hidden py-1">
      <div className={`marquee-track ${direction === "l" ? "marquee-l" : "marquee-r"}`}>
        {loop.map((word, i) => (
          <span key={`${word}-${i}`} className="flex items-center" aria-hidden={i >= words.length}>
            <span className="font-display italic text-[clamp(1.6rem,4vw,2.9rem)] font-light text-plum/85 whitespace-nowrap px-6 transition-colors duration-300 hover:text-plum">
              {word}
            </span>
            <span className="text-gold-400 text-xl select-none" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function OutcomesMarquee() {
  const t = useTranslations("marquee");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="relative overflow-hidden bg-section-elevated py-12 md:py-16">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lav-300/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE_LUXURY }}
        className="relative z-10 mb-6 flex items-center justify-center gap-3"
      >
        <span className="w-8 h-px bg-gold-400/70" />
        <span className="text-eyebrow text-lav-600">{t("label")}</span>
        <span className="w-8 h-px bg-gold-400/70" />
      </motion.div>

      <div className="relative z-10 space-y-2">
        <Track words={ROW_A} direction="l" />
        <Track words={ROW_B} direction="r" />
      </div>
    </section>
  );
}
