import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/* Merges Tailwind classes with the last one winning (used by all UI components). */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
