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
  setLang: (lang: string) => void;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  addReview: (review: Review) => void;
  addDraft: (draft: Draft) => void;
  toggleWishlist: (item: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      lang: 'en',
      theme: 'dark',
      reviews: INITIAL_REVIEWS,
      drafts: [],
      wishlist: ['Sigiriya','Arugam Bay','Ella','Jaffna','Mirissa'],
      setLang: (lang) => set({ lang }),
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
      })
    }),
    {
      name: 'visitceylon-storage',
    }
  )
);

export function useTranslation() {
  const lang = useAppStore((state) => state.lang);
  const t = (key: string) => {
    if (!key) return '';
    return (
      DICTIONARIES[lang]?.[key] || 
      DICTIONARIES['en']?.[key] || 
      CONTENT_TRANSLATIONS[lang]?.[key] || 
      CONTENT_TRANSLATIONS['en']?.[key] || 
      key
    );
  };
  return { t, lang };
}
