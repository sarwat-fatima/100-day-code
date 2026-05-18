import { create } from "zustand";

type Theme = "light" | "dark" | "system";

function nextTheme(t: Theme): Theme {
  if (t === "system") return "light";
  if (t === "light") return "dark";
  return "system";
}

export const useUIStore = create<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}>((set, get) => ({
  theme: "system",
  setTheme: (t) => set({ theme: t }),
  toggleTheme: () => set({ theme: nextTheme(get().theme) })
}));

