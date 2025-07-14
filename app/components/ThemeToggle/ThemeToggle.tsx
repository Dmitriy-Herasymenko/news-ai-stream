"use client";

import { useEffect } from "react";
import { useThemeStore } from "../../stores/themeStore";

export default function ThemeToggle() {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, [setTheme]);

  return (
    <button
      onClick={toggleTheme}
      className={`
        px-4 py-2
        border
        transition-colors
        duration-300
        uppercase
        tracking-wider
        text-sm
        font-semibold
        ${
          theme === "dark"
            ? "bg-black text-white border-white hover:bg-white hover:text-black"
            : "bg-white text-black border-black hover:bg-black hover:text-white"
        }
      `}
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
