"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  authClient,
  fetchSession,
  getStoredToken,
  persistAuth,
  readStoredUser,
  requestJwt,
  resetStoredAuth,
} from "@/lib/auth";

const AuthContext = createContext(null);

/* Keeps the logged-in user in React state and mirrors it in localStorage so a
   page reload never throws the visitor back to the login page. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  /* Counts every refreshCurrentUser call; responses from older calls are
     dropped so a slow restore can never overwrite a newer login. */
  const refreshEpoch = useRef(0);

  /* Restores (or discovers) the current session without forcing a login redirect:
     - stored JWT + user info are used first (fast path after a reload),
     - otherwise the BetterAuth session cookie is checked, which also picks up
       visitors that just came back from Google sign-in. */
  const refreshCurrentUser = useCallback(async ({ notify = false } = {}) => {
    const callEpoch = ++refreshEpoch.current;
    const storedUser = readStoredUser();
    const storedToken = getStoredToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      return storedUser;
    }

    const session = await fetchSession();
    if (callEpoch !== refreshEpoch.current) return null;
    if (session?.user) {
      const token = storedToken || (await requestJwt());
      if (callEpoch !== refreshEpoch.current) return null;
      persistAuth(session.user, token);
      setUser(session.user);
      if (notify) toast.success(`Welcome, ${session.user.name || "friend"}!`);
      return session.user;
    }

    setUser(null);
    return null;
  }, []);

  useEffect(() => {
    refreshCurrentUser().finally(() => setLoading(false));
  }, [refreshCurrentUser]);

  /* Synced with the axios interceptor: remove React state once the token dies. */
  useEffect(() => {
    const onAuthExpired = () => setUser(null);
    window.addEventListener("sebak:auth-expired", onAuthExpired);
    return () => window.removeEventListener("sebak:auth-expired", onAuthExpired);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authClient.signOut();
    } catch {
      /* The local session is cleared below either way. */
    }
    resetStoredAuth();
    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isLoggedIn: Boolean(user), setUser, refreshCurrentUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
