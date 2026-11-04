export const USER_KEY = "sebak_user";
const LEGACY_TOKEN_KEY = "sebak_token";

export async function fetchSession() {
  try {
    const response = await fetch("/api/auth/get-session", {
      credentials: "same-origin",
    });
    if (!response.ok) return null;

    const session = await response.json();
    return session?.user ? session : null;
  } catch {
    return null;
  }
}


export async function refreshJwtCookie() {
  try {
    const response = await fetch("/api/auth/token-cookie", {
      method: "POST",
      credentials: "same-origin",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function clearJwtCookie() {
  try {
    await fetch("/api/auth/token-cookie", {
      method: "DELETE",
      credentials: "same-origin",
    });
  } catch {

  }
}

export function readStoredUser() {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function persistUser(user) {
  if (typeof window === "undefined" || !user) return;
  window.localStorage.removeItem(LEGACY_TOKEN_KEY);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function resetStoredAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(LEGACY_TOKEN_KEY);
}
