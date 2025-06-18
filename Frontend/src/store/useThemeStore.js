import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme:  "sunset",
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "sunset" ? "acid" : "sunset",
    })),
  setTheme: (theme) => set({ theme }),
}));

export default useThemeStore;