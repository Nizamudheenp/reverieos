"use client";

import { useEffect, useState } from "react";

/**
 * ThemeProvider
 * - reads /api/settings (GET)
 * - applies theme to <html> by toggling `.dark`
 * - stores chosen theme in localStorage for instant behavior
 */
export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "system";
    return localStorage.getItem("theme") || "system";
  });

  // load saved server setting once on mount (won't block render)
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted && data?.theme) {
          setTheme(data.theme);
          localStorage.setItem("theme", data.theme);
        }
      } catch (e) {
        // ignore
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  // apply theme when `theme` changes
  useEffect(() => {
    const root = document.documentElement;

    function apply(t) {
      if (t === "light") {
        root.classList.remove("dark");
      } else if (t === "dark") {
        root.classList.add("dark");
      } else {
        // system
        const prefersDark =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        prefersDark ? root.classList.add("dark") : root.classList.remove("dark");
      }
    }

    apply(theme);

    // if system, listen for changes
    if (theme === "system" && window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = (e) => {
        if (e.matches) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
      };
      mq.addEventListener?.("change", listener);
      return () => mq.removeEventListener?.("change", listener);
    }
  }, [theme]);

  return <>{children}</>;
}
