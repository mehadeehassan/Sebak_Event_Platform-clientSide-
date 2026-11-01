"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";

/* Guards the private pages (/create-event, /manage-events, /joined-events).
   It only redirects once the session check has fully finished, so a logged-in
   user reloading a private route is never bounced back to /login. */
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      toast.info("Please log in to view this page.");
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, pathname, router]);

  return { user, loading };
}
