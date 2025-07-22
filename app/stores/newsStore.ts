import { create } from "zustand";

interface NewsStore {
  category: string;
  country: string;
  setCategory: (category: string) => void;
  setCountry: (country: string) => void;
}

export const useNewsStore = create<NewsStore>((set) => ({
  category: "",
  country: "ua", 
  setCategory: (category) => set({ category }),
  setCountry: (country) => set({ country }),
}));
