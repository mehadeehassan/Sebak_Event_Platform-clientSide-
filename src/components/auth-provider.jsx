/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  clearJwtCookie,
  fetchSession,
  persistUser,
  readStoredUser,
  refreshJwtCookie,
  resetStoredAuth,
} from "@/lib/auth-session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshEpoch = useRef(0);

  const refreshCurrentUser = useCallback(async ({ notify = false } = {}) => {
    const callEpoch = ++refreshEpoch.current;
    const storedUser = readStoredUser();
    if (storedUser) setUser(storedUser);

    const session = await fetchSession();
    if (callEpoch !== refreshEpoch.current) return null;
    if (session?.user) {
      const cookieReady = await refreshJwtCookie();
      if (callEpoch !== refreshEpoch.current) return null;
      if (!cookieReady) {
        resetStoredAuth();
        setUser(null);
        return null;
      }
      persistUser(session.user);
      setUser(session.user);
      if (notify) toast.success(`Welcome, ${session.user.name || "friend"}!`);
      return session.user;
    }

    resetStoredAuth();
    setUser(null);
    return null;
  }, []);

  useEffect(() => {
    refreshCurrentUser().finally(() => setLoading(false));
  }, [refreshCurrentUser]);


  useEffect(() => {
    const onAuthExpired = () => {
      resetStoredAuth();
      void clearJwtCookie();
      setUser(null);
    };
    window.addEventListener("sebak:auth-expired", onAuthExpired);
    return () => window.removeEventListener("sebak:auth-expired", onAuthExpired);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authClient.signOut();
    } catch {

    }
    await clearJwtCookie();
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
