"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DICTIONARIES } from './data/dictionaries';
import { CONTENT_TRANSLATIONS } from './data/contentTranslations';
import { Review } from './data/mockData';
import { INITIAL_REVIEWS } from './data/mockData';

type Draft = {
  name: string;
  date: string;
};

type AppState = {
  lang: string;
  theme: string;
  reviews: Review[];
  drafts: Draft[];
  wishlist: string[];
  dynamicTranslations: Record<string, Record<string, string>>;
  setLang: (lang: string) => void;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  addReview: (review: Review) => void;
  addDraft: (draft: Draft) => void;
  toggleWishlist: (item: string) => void;
  addDynamicTranslation: (lang: string, key: string, translation: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lang: 'en',
      theme: 'dark',
      reviews: INITIAL_REVIEWS,
      drafts: [],
      wishlist: ['Sigiriya','Arugam Bay','Ella','Jaffna','Mirissa'],
      dynamicTranslations: {},
      setLang: (lang) => {
        const mainEl = typeof document !== "undefined" ? document.querySelector("main") : null;
        if (mainEl) {
          mainEl.classList.add("lang-transition-active");
          setTimeout(() => {
            set({ lang });
            setTimeout(() => {
              mainEl.classList.remove("lang-transition-active");
            }, 50);
          }, 240);
        } else {
          set({ lang });
        }
      },
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      addReview: (review) => set((state) => ({ reviews: [review, ...state.reviews] })),
      addDraft: (draft) => set((state) => {
        if (!state.drafts.find(d => d.name === draft.name)) {
          return { drafts: [...state.drafts, draft] };
        }
        return state;
      }),
      toggleWishlist: (item) => set((state) => {
        if (state.wishlist.includes(item)) {
          return { wishlist: state.wishlist.filter(w => w !== item) };
        }
        return { wishlist: [...state.wishlist, item] };
      }),
      addDynamicTranslation: (lang, key, translation) => set((state) => ({
        dynamicTranslations: {
          ...state.dynamicTranslations,
          [lang]: {
            ...(state.dynamicTranslations[lang] || {}),
            [key]: translation
          }
        }
      }))
    }),
    {
      name: 'visitceylon-storage',
      // Merge function to prevent data structure mismatches with persisted state
      partialize: (state) => ({
        lang: state.lang,
        theme: state.theme,
        reviews: state.reviews,
        drafts: state.drafts,
        wishlist: state.wishlist,
        dynamicTranslations: state.dynamicTranslations,
      }),
    }
  )
);

const pendingTranslations = new Set<string>();

export function hasPendingTranslations() {
  return pendingTranslations.size > 0;
}

async function fetchTranslation(text: string, to: string, callback: (lang: string, key: string, translation: string) => void) {
  const cacheKey = `${to}:${text}`;
  if (pendingTranslations.has(cacheKey)) return;
  pendingTranslations.add(cacheKey);

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, to }),
    });
    const data = await res.json();
    if (data.translatedText) {
      callback(to, text, data.translatedText);
    }
  } catch (err) {
    console.error("Failed to dynamically translate", text, "to", to, err);
  } finally {
    pendingTranslations.delete(cacheKey);
  }
}

export function useTranslation() {
  const lang = useAppStore((state) => state.lang);
  const dynamicTranslations = useAppStore((state) => state.dynamicTranslations) || {};
  const addDynamicTranslation = useAppStore((state) => state.addDynamicTranslation);

  const t = (key: string) => {
    if (!key) return '';

    // 1. Check static UI dictionaries
    const staticUI = DICTIONARIES[lang]?.[key];
    if (staticUI) return staticUI;

    // 2. Check static Content translations
    const staticContent = CONTENT_TRANSLATIONS[lang]?.[key];
    if (staticContent) return staticContent;

    // 3. Check dynamic translations cache
    const cached = dynamicTranslations[lang]?.[key];
    if (cached) return cached;

    // 4. Fallback to English translation key/value
    const englishFallback = 
      DICTIONARIES['en']?.[key] || 
      CONTENT_TRANSLATIONS['en']?.[key];
      
    const sourceText = englishFallback || key;

    // 5. Trigger dynamic translation if not in English
    if (lang !== 'en' && typeof window !== "undefined") {
      fetchTranslation(sourceText, lang, addDynamicTranslation);
    }

    return sourceText;
  };
  return { t, lang };
}
