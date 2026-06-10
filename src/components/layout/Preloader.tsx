"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";

const STORAGE_KEY = "pouma-preloader-seen";

export default function Preloader() {
  const t = useTranslations("preloader");
  const messages = [t("m1"), t("m2"), t("m3"), t("m4")];
  const [visible, setVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [phase, setPhase] = useState<"logo" | "message" | "exit">("logo");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (seen) return;
    setVisible(true);
    document.body.style.overflow = "hidden";

    const msgTimer = setTimeout(() => setPhase("message"), 900);
    const cycle = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 2200);
    const exitTimer = setTimeout(() => setPhase("exit"), 4200);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(STORAGE_KEY, "1");
      document.body.style.overflow = "";
    }, 5200);

    return () => {
      clearTimeout(msgTimer);
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
      clearInterval(cycle);
      document.body.style.overflow = "";
    };
  }, [messages.length]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: EASE_LUXURY }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-plum-mid overflow-hidden"
          aria-live="polite"
          aria-busy={phase !== "exit"}
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-lav-700/30 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-gold-400/12 blur-3xl" />
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(176,154,232,0.2) 0%, transparent 70%)",
              }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={
              phase === "exit"
                ? { scale: 1.08, opacity: 0, filter: "blur(12px)" }
                : { scale: 1, opacity: 1, filter: "blur(0px)" }
            }
            transition={{ duration: 1, ease: EASE_LUXURY }}
            className="relative z-10 flex flex-col items-center text-center px-8"
          >
            <motion.div
              className="relative w-28 h-28 mb-10"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/finallogo.png"
                alt="The Pouma Academy"
                fill
                className="object-contain drop-shadow-[0_0_30px_rgba(176,154,232,0.55)]"
                sizes="112px"
                priority
              />
            </motion.div>

            <motion.p
              className="font-display text-xs tracking-[0.35em] uppercase text-lav-300/80 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              The Pouma Academy
            </motion.p>

            <div className="h-16 flex items-center justify-center max-w-md">
              <AnimatePresence mode="wait">
                {phase !== "logo" && (
                  <motion.p
                    key={messageIndex}
                    initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                    transition={{ duration: 0.75, ease: EASE_LUXURY }}
                    className="font-display italic text-xl md:text-2xl text-white/90 leading-snug"
                  >
                    {messages[messageIndex]}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              className="mt-14 h-px w-32 bg-gradient-to-r from-transparent via-lav-400/50 to-transparent overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="h-full w-1/2 bg-gradient-to-r from-transparent via-gold-400 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
