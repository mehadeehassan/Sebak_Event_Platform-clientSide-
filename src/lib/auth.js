/* BetterAuth client + helpers that keep the JWT session alive in the browser. */
import { createAuthClient } from "better-auth/client";

/* The REST api (events, joins) runs on the express server... */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
/* ...while BetterAuth lives on this very app, served itself at /api/auth. */
export const AUTH_BASE = typeof window === "undefined" ? "" : window.location.origin;

export const TOKEN_KEY = "sebak_token";
export const USER_KEY = "sebak_user";

export const authClient = createAuthClient();

/* Reads the BetterAuth session cookie of this app. Returns { session, user }. */
export async function fetchSession() {
  try {
    const res = await fetch(`${AUTH_BASE}/api/auth/get-session`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.user ? data : null;
  } catch {
    return null;
  }
}

/* Asks the BetterAuth jwt plugin for the JWT tied to the current session. */
export async function requestJwt() {
  try {
    const res = await fetch(`${AUTH_BASE}/api/auth/token`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data === "string" ? data : data?.token || null;
  } catch {
    return null;
  }
}

export function readStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function persistAuth(user, token) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
}

export function resetStoredAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

/* Turns lower level BetterAuth errors into messages a user can understand. */
export function mapAuthError(error) {
  const message = error?.message || error?.response?.data?.message || "";
  if (/invalid email or password/i.test(message)) return "Invalid email or password.";
  if (/already exists|registered|in use/i.test(message)) {
    return "An account with this email already exists.";
  }
  if (message) return message.charAt(0).toUpperCase() + message.slice(1);
  return "Something went wrong. Please try again.";
}

/* Only allows internal paths so a crafted ?redirect= cannot leave the app. */
export function safeRedirect(value, fallback = "/") {
  if (typeof value !== "string" || !value.trim() || !value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  return value;
}
