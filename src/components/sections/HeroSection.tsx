"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import PremiumButton from "@/components/ui/PremiumButton";
import { EASE_LUXURY } from "@/lib/motion";

type TrustStat = { value: string; label: string };

/**
 * Animated count-up for a trust stat. Parses the leading number from values
 * like "19", "3.500+", "98%", animates 0 → target on mount, re-formats with
 * Greek thousands grouping while preserving the original suffix, and falls
 * back to the static value when the user prefers reduced motion.
 */
function CountUpStat({ value, delay }: { value: string; delay: number }) {
  const reduce = useReducedMotion();
  const match = value.match(/^([\d.,]+)(.*)$/);
  const target = match ? parseInt(match[1].replace(/[^\d]/g, ""), 10) : NaN;
  const suffix = match ? match[2] : "";
  const animateOk = !reduce && !Number.isNaN(target);
  const [display, setDisplay] = useState(() => (animateOk ? "0" : value));

  useEffect(() => {
    if (!animateOk) return;
    const fmt = (v: number) => Math.round(v).toLocaleString("el-GR") + suffix;
    const duration = 1700;
    const delayMs = delay * 1000;
    let raf = 0;
    let startTs = 0;
    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const elapsed = ts - startTs - delayMs;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(fmt(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(fmt(target));
    };
    raf = requestAnimationFrame(tick);
    const fallback = setTimeout(() => setDisplay(fmt(target)), delayMs + duration + 250);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
    };
  }, [animateOk, target, suffix, delay]);

  return <span className="tabular-nums">{display}</span>;
}

/** A floating glass card that parallaxes with the cursor and drifts on its own. */
function FloatCard({
  x,
  y,
  className,
  delay,
  floatClass,
  children,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  className: string;
  delay: number;
  floatClass: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{ x, y }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: EASE_LUXURY }}
      className={`absolute hidden lg:block ${className}`}
    >
      <div className={floatClass}>{children}</div>
    </motion.div>
  );
}

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);

  // Cursor parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });

  const orbX = useTransform(sx, [-0.5, 0.5], [-46, 46]);
  const orbY = useTransform(sy, [-0.5, 0.5], [-28, 28]);
  const orbX2 = useTransform(sx, [-0.5, 0.5], [34, -34]);
  const orbY2 = useTransform(sy, [-0.5, 0.5], [22, -22]);

  // Per-card parallax (opposite depths for a layered feel)
  const cardTLx = useTransform(sx, [-0.5, 0.5], [-26, 26]);
  const cardTLy = useTransform(sy, [-0.5, 0.5], [-18, 18]);
  const cardTRx = useTransform(sx, [-0.5, 0.5], [24, -24]);
  const cardTRy = useTransform(sy, [-0.5, 0.5], [-14, 14]);
  const cardBLx = useTransform(sx, [-0.5, 0.5], [-20, 20]);
  const cardBLy = useTransform(sy, [-0.5, 0.5], [16, -16]);
  const cardBRx = useTransform(sx, [-0.5, 0.5], [22, -22]);
  const cardBRy = useTransform(sy, [-0.5, 0.5], [18, -18]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);
  const monogramY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    if (!mq.matches) return;
    window.addEventListener("mousemove", fn, { passive: true });
    const onChange = () => {
      if (!mq.matches) {
        mx.set(0);
        my.set(0);
        window.removeEventListener("mousemove", fn);
      }
    };
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("mousemove", fn);
      mq.removeEventListener("change", onChange);
    };
  }, [mx, my]);

  const lines = [t("headline1"), t("headline2"), t("headline3")];
  const trust = t.raw("trust") as TrustStat[];
  const avatars = [
    "/testimonials/avatar-maria.jpg",
    "/testimonials/avatar-alex.jpg",
    "/testimonials/avatar-sofia.jpg",
    "/testimonials/avatar-eleni.jpg",
    "/testimonials/avatar-nikos.jpg",
  ];

  // Word-level stagger for the headline
  let wordIndex = 0;

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-hero-canvas"
    >
      {/* ── Atmospheric background ─────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {/* giant monogram watermark */}
        <motion.div
          style={{ y: monogramY }}
          className="breathe absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[min(78vw,46rem)] aspect-square opacity-[0.05]"
        >
          <Image src="/finallogo.png" alt="" fill className="object-contain" sizes="46rem" priority={false} />
        </motion.div>

        {/* aurora glow behind the headline */}
        <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(155,111,232,0.20),rgba(245,179,53,0.08)_45%,transparent_70%)] blur-[40px]" />

        {/* parallax orbs */}
        <motion.div
          style={{ x: orbX, y: orbY }}
          className="absolute -left-[12vw] top-[6%] w-[46vw] max-w-[34rem] aspect-square rounded-full bg-[radial-gradient(circle_at_center,rgba(155,111,232,0.30)_0%,rgba(173,144,255,0.14)_42%,transparent_70%)] blur-[6px]"
        />
        <motion.div
          style={{ x: orbX2, y: orbY2 }}
          className="absolute -right-[10vw] bottom-[2%] w-[42vw] max-w-[31rem] aspect-square rounded-full bg-[radial-gradient(circle_at_center,rgba(245,179,53,0.24)_0%,rgba(255,217,120,0.10)_45%,transparent_72%)]"
        />
        {/* auto-drift orbs */}
        <div className="drift-a absolute left-[58%] top-[12%] w-[28vw] max-w-[20rem] aspect-square rounded-full bg-[radial-gradient(circle_at_center,rgba(245,179,53,0.16)_0%,transparent_70%)]" />
        <div className="drift-b absolute left-[10%] bottom-[16%] w-[26vw] max-w-[19rem] aspect-square rounded-full bg-[radial-gradient(circle_at_center,rgba(155,111,232,0.14)_0%,transparent_70%)]" />

        <div className="absolute inset-0 dot-grid opacity-[0.05]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-ivory" />
      </div>

      {/* ── Floating glass cards ───────────────────────────────── */}
      <FloatCard
        x={cardTLx}
        y={cardTLy}
        delay={1.0}
        className="left-[5%] xl:left-[8%] top-[20%]"
        floatClass="float-slow glass shadow-medium rounded-2xl px-4 py-3 flex items-center gap-3"
      >
        <div className="flex flex-col">
          <span className="text-gold-400 text-sm leading-none" aria-hidden>★★★★★</span>
          <span className="mt-1.5 text-[11px] font-medium text-plum/65 max-w-[8rem] leading-tight">
            {t("ratingLabel")}
          </span>
        </div>
      </FloatCard>

      <FloatCard
        x={cardTRx}
        y={cardTRy}
        delay={1.15}
        className="right-[5%] xl:right-[9%] top-[16%]"
        floatClass="float-slow glass shadow-medium rounded-2xl px-3.5 py-3 flex items-center gap-3"
      >
        <span className="relative h-11 w-11 rounded-full overflow-hidden ring-2 ring-gold-300/70 shadow-soft">
          <Image src="/dimitra.png" alt={t("portraitName")} fill sizes="44px" className="object-cover object-top" />
        </span>
        <div className="text-left">
          <p className="font-display text-base text-plum leading-tight">{t("portraitName")}</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-lav-600">{t("portraitRole")}</p>
        </div>
      </FloatCard>

      <FloatCard
        x={cardBLx}
        y={cardBLy}
        delay={1.3}
        className="left-[8%] xl:left-[12%] bottom-[20%]"
        floatClass="float-slow-rev glass shadow-medium rounded-2xl px-4 py-3 flex items-center gap-3"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-plum font-display text-lg font-semibold shadow-gold-glow">
          19
        </span>
        <span className="text-xs font-medium text-plum/75 max-w-[7rem] leading-tight">{trust[0].label}</span>
      </FloatCard>

      <FloatCard
        x={cardBRx}
        y={cardBRy}
        delay={1.45}
        className="right-[7%] xl:right-[11%] bottom-[22%]"
        floatClass="float-slow-rev glass shadow-medium rounded-2xl px-4 py-3"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-lav-600">English for</span>
        <div className="mt-1.5 flex flex-wrap gap-1.5 max-w-[10rem]">
          {["Meetings", "Interviews", "Pitches"].map((w) => (
            <span key={w} className="rounded-full bg-lav-100 px-2 py-0.5 text-[11px] font-medium text-plum/75">
              {w}
            </span>
          ))}
        </div>
      </FloatCard>

      {/* ── Center stage ───────────────────────────────────────── */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity, scale }}
        className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-6 pt-96 pb-20 text-center"
      >

        {/* headline — word stagger */}
        <h1 className="mb-7">
          {lines.map((line, li) => (
            <span key={li} className="block">
              {line.split(" ").map((word) => {
                const wi = wordIndex++;
                return (
                  <span key={`${li}-${wi}`} className="inline-block overflow-hidden align-baseline">
                    <motion.span
                      initial={{ y: "115%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1.05, delay: 0.32 + wi * 0.08, ease: EASE_LUXURY }}
                      className={`text-display-xl inline-block pr-[0.22em] text-[clamp(2.6rem,8vw,5.4rem)] ${
                        li === 1 ? "text-gradient" : "text-plum"
                      }`}
                    >
                      {word}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        {/* subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85, ease: EASE_LUXURY }}
          className="text-body-premium text-lg md:text-xl max-w-2xl mx-auto mb-9"
        >
          {t("subtext")}
        </motion.p>


        {/* glass stat bar */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3, ease: EASE_LUXURY }}
          className="mt-11 inline-flex flex-wrap items-center justify-center gap-x-7 gap-y-5 rounded-[1.75rem] glass shadow-medium px-7 py-5"
        >
          {/* avatar stack */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {avatars.map((src, i) => (
                <span
                  key={src}
                  className="relative h-9 w-9 rounded-full ring-2 ring-ivory overflow-hidden shadow-soft"
                  style={{ zIndex: avatars.length - i }}
                >
                  <Image src={src} alt="" fill sizes="36px" className="object-cover" />
                </span>
              ))}
            </div>
            <div className="text-left">
              <div className="flex text-gold-400 text-xs leading-none" aria-hidden>★★★★★</div>
              <p className="mt-0.5 text-[11px] text-plum/55 max-w-[7rem] leading-tight">{t("ratingLabel")}</p>
            </div>
          </div>

          <span className="hidden sm:block h-10 w-px bg-lav-200" aria-hidden />

          {/* count-up stats */}
          {trust.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-7">
              {i > 0 && <span className="hidden sm:block h-10 w-px bg-lav-200" aria-hidden />}
              <div className="text-center">
                <div className="font-display text-2xl sm:text-[1.7rem] text-plum leading-none">
                  <CountUpStat value={stat.value} delay={1.5 + i * 0.18} />
                </div>
                <div className="mt-1.5 text-[11px] text-plum/55 leading-tight max-w-[8rem]">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTAs below the stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 1.35, ease: EASE_LUXURY }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <PremiumButton href={`/${locale}/contact`} variant="primary" size="lg">
            {t("cta1")}
            <motion.svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </motion.svg>
          </PremiumButton>
          <PremiumButton href={`/${locale}/programs`} variant="secondary" size="lg">
            {t("cta2")}
          </PremiumButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.55, ease: EASE_LUXURY }}
          className="mt-4"
        >
          <a
            href="#puma"
            className="group inline-flex items-center gap-1.5 text-sm text-lav-700/80 hover:text-lav-700 transition-colors"
          >
            <span className="underline decoration-gold-400/50 decoration-1 underline-offset-4 group-hover:decoration-gold-400">
              {t("whyName")}
            </span>
            <motion.span
              aria-hidden
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
          </a>
        </motion.div>
      </motion.div>

    </section>
  );
}
