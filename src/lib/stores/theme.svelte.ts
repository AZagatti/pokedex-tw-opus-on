import { browser } from "$app/environment";

export type Theme = "light" | "dark";

const STORAGE_KEY = "pokedex:theme";

function initial(): Theme {
  if (!browser) {
    return "light";
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

class ThemeStore {
  value = $state<Theme>(initial());

  constructor() {
    this.apply();
  }

  private apply(): void {
    if (browser) {
      document.documentElement.classList.toggle("dark", this.value === "dark");
      localStorage.setItem(STORAGE_KEY, this.value);
    }
  }

  toggle(): void {
    this.value = this.value === "dark" ? "light" : "dark";
    this.apply();
  }

  set(theme: Theme): void {
    this.value = theme;
    this.apply();
  }
}

export const theme = new ThemeStore();
