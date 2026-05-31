"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Variant = "navbar" | "mobile";

const LABELS = {
  el: { group: "Γλώσσα", el: "Ελληνικά", en: "English" },
  en: { group: "Language", el: "Ελληνικά", en: "English" },
} as const;

export default function LanguageSwitcher({ variant = "navbar" }: { variant?: Variant }) {
  const locale = useLocale() as "el" | "en";
  const pathname = usePathname();
  const router = useRouter();
  const labels = LABELS[locale];

  const setLocale = (next: "el" | "en") => {
    if (next === locale) return;
    const stripped = pathname.replace(`/${locale}`, "") || "/";
    router.push(`/${next}${stripped === "/" ? "" : stripped}`);
  };

  const isMobile = variant === "mobile";

  return (
    <div
      role="group"
      aria-label={labels.group}
      className={cn("flex items-center", isMobile && "flex-1 justify-center")}
    >
      <div
        className={cn(
          "flex rounded-full p-1 border",
          isMobile
            ? "border-white/15 bg-white/5 flex-1"
            : "border-lav-200/80 bg-lav-50/60 shadow-soft"
        )}
      >
        {(["el", "en"] as const).map((code) => {
          const active = locale === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              aria-pressed={active}
              aria-label={labels[code]}
              className={cn(
                "relative min-w-[2.75rem] px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer",
                active
                  ? isMobile
                    ? "bg-white text-plum shadow-sm"
                    : "bg-white text-lav-700 shadow-soft ring-1 ring-lav-200/80"
                  : isMobile
                    ? "text-white/45 hover:text-white/75"
                    : "text-plum/40 hover:text-plum/70"
              )}
            >
              {code.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
