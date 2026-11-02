"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";


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
