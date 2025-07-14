import { create } from "zustand";

interface NewsStore {
  category: string;
  setCategory: (category: string) => void;
}

export const useNewsStore = create<NewsStore>((set) => ({
  category: "",
  setCategory: (category) => set({ category }),
}));
