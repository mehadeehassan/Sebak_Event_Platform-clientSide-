"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/* Applies the light/dark class on <html> and keeps the choice in localStorage. */
export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
