import type { Metadata } from "next";

export const siteConfig = {
  name: "The Pouma Academy",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://poumaacademy.gr",
  email: "ask@thepoumaacademy.com",
  phone: "+30 210 000 0000",
  locale: "el_GR",
  alternateLocale: "en_US",
  twitterHandle: "@poumaacademy",
};

const titles: Record<string, { el: string; en: string }> = {
  home: {
    el: "The Pouma Academy | Μεταμόρφωση μέσω Αγγλικών & Επικοινωνίας",
    en: "The Pouma Academy | Transformation Through English & Communication",
  },
  programs: {
    el: "Προγράμματα Εξέλιξης | The Pouma Academy",
    en: "Evolution Programs | The Pouma Academy",
  },
  about: {
    el: "Η Δήμητρα | The Pouma Academy",
    en: "Dimitra | The Pouma Academy",
  },
  contact: {
    el: "Επικοινωνία & Δωρεάν Αξιολόγηση | The Pouma Academy",
    en: "Contact & Free Assessment | The Pouma Academy",
  },
  resources: {
    el: "Η τάξη μας | The Pouma Academy",
    en: "Our Class | The Pouma Academy",
  },
};

const descriptions: Record<string, { el: string; en: string }> = {
  home: {
    el: "Boutique ακαδημία μεταμόρφωσης στην Αθήνα. Εξειδικευμένα προγράμμες αγγλικών, communication coaching και επαγγελματική παρουσία σε μικρές ομάδες 3–4 ατόμων.",
    en: "Boutique transformation academy in Athens. Specialized English programs, communication coaching, and professional presence in groups of 3–4.",
  },
  programs: {
    el: "Επίλεξε το πρόγραμμα εξέλιξής σου: Foundation Reset, Voice Accelerator, Professional Excellence ή Custom Journey. Αγγλικά με στόχο την πραγματική έκφραση.",
    en: "Choose your evolution path: Foundation Reset, Voice Accelerator, Professional Excellence, or Custom Journey. English focused on real expression.",
  },
  about: {
    el: "Γνώρισε τη Δήμητρα Γιαννουπλάκη — communication coach με 12+ χρόνια εμπειρίας στη μεταμόρφωση ανθρώπων μέσω των αγγλικών.",
    en: "Meet Dimitra Giannouplaki — communication coach with 12+ years transforming people through English.",
  },
  contact: {
    el: "Κλείσε δωρεάν αξιολόγηση. Η πρώτη γνωριμία είναι χωρίς δέσμευση — ανακαλύψτε μαζί πού βρίσκεστε και πού θέλετε να φτάσετε.",
    en: "Book a free assessment. Your first introduction is commitment-free — discover where you are and where you want to go.",
  },
  resources: {
    el: "Η τάξη μας — αποκλειστικό υλικό για σπουδαστές της The Pouma Academy. Άρθρα, βίντεο και υλικό μελέτης εκτός τάξης.",
    en: "Our Class — exclusive materials for The Pouma Academy students. Articles, extras, and study resources beyond class.",
  },
};

export function pageMetadata(
  page: keyof typeof titles,
  locale: string
): Metadata {
  const lang = locale === "en" ? "en" : "el";
  const title = titles[page][lang];
  const description = descriptions[page][lang];
  const canonical = `${siteConfig.url}/${locale}${page === "home" ? "" : `/${page}`}`;

  return {
    title,
    description,
    keywords: [
      "αγγλικά Αθήνα",
      "English coaching Athens",
      "communication coaching",
      "The Pouma Academy",
      "μεταμόρφωση αγγλικά",
      "executive English",
      "παρουσίαση αγγλικά",
    ],
    authors: [{ name: "Dimitra Giannouplaki" }],
    creator: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical,
      languages: {
        el: `${siteConfig.url}/el${page === "home" ? "" : `/${page}`}`,
        en: `${siteConfig.url}/en${page === "home" ? "" : `/${page}`}`,
      },
    },
    openGraph: {
      type: "website",
      locale: lang === "el" ? "el_GR" : "en_US",
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function organizationJsonLd(locale: string) {
  const isEl = locale === "el";
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    description: isEl
      ? "Boutique ακαδημία μεταμόρφωσης — αγγλικά, communication coaching και επαγγελματική παρουσία."
      : "Boutique transformation academy — English, communication coaching, and professional presence.",
    areaServed: { "@type": "Country", name: "Greece" },
    knowsLanguage: ["el", "en"],
    sameAs: [],
  };
}
