"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";

/** Build monotonic scroll keyframes for one quote segment (required by Motion/WAAPI). */
function segmentRange(index: number, total: number) {
  const start = index / total;
  const end = (index + 1) / total;
  const span = end - start;
  const fade = Math.min(span * 0.45, 0.14);

  let peakStart = start + fade;
  let peakEnd = end - fade;

  if (peakEnd <= peakStart) {
    const mid = (start + end) / 2;
    const eps = span * 0.02;
    peakStart = mid - eps;
    peakEnd = mid + eps;
  }

  return {
    input: [start, peakStart, peakEnd, end] as [number, number, number, number],
  };
}

function StickyQuote({
  text,
  index,
  total,
  scrollYProgress,
}: {
  text: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const isLeft = index % 2 === 0;
  const { input } = segmentRange(index, total);

  const opacity = useTransform(scrollYProgress, input, [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, input, [20, 0, 0, -20]);
  const scale = useTransform(scrollYProgress, input, [0.98, 1, 1, 0.98]);
  const lineScale = useTransform(scrollYProgress, input, [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={`absolute inset-0 flex items-center px-6 md:px-16 pointer-events-none ${
        isLeft ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`relative max-w-lg md:max-w-2xl ${isLeft ? "text-left" : "text-right ml-auto"}`}
      >
        <p className="font-display italic text-[clamp(1.35rem,3.5vw,2.5rem)] text-plum leading-snug tracking-tight">
          {text}
        </p>
        <motion.div
          style={{ scaleX: lineScale }}
          className={`mt-8 h-px w-24 bg-gradient-to-r from-lav-500/80 to-transparent ${
            !isLeft ? "ml-auto origin-right" : "origin-left"
          }`}
        />
      </div>
    </motion.div>
  );
}

export default function ScrollQuotes() {
  const t = useTranslations("scrollQuotes");
  const containerRef = useRef<HTMLDivElement>(null);

  const quotes = [t("q1"), t("q2"), t("q3"), t("q4"), t("q5"), t("q6")];
  const total = quotes.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const lineH = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), {
    stiffness: 80,
    damping: 28,
  });
  return (
    <section
      ref={containerRef}
      className="relative bg-ivory"
      style={{ height: `${total * 100}vh` }}
      aria-label="Inner voices"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <div className="absolute left-1/2 top-0 bottom-0 w-px overflow-hidden hidden md:block pointer-events-none -translate-x-1/2">
          <motion.div
            style={{ height: lineH, originY: 0 }}
            className="w-full bg-gradient-to-b from-transparent via-lav-400/40 to-transparent"
          />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,640px)] h-[min(50vh,400px)] rounded-full bg-lav-100/40 blur-3xl" />
        </div>

        <div className="relative w-full max-w-6xl mx-auto h-full">
          {quotes.map((q, i) => (
            <StickyQuote
              key={i}
              text={q}
              index={i}
              total={total}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
