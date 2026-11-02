"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, HeartHandshake, LoaderCircle, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { authClient, mapAuthError, resetStoredAuth, safeRedirect } from "@/lib/auth";
import { useAuth } from "@/components/auth-provider";
import { isValidEmail } from "@/lib/validate";
import AuthShell from "@/components/auth-shell";

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshCurrentUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirect = safeRedirect(searchParams.get("redirect"), "/");

  function setField(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    };
  }

  function validate() {
    const next = {};
    if (!isValidEmail(form.email)) next.email = "Please enter a valid email address.";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { error } = await authClient.signIn.email({
        email: form.email.trim(),
        password: form.password,
        remember: true,
      });
      if (error) throw error;

      /* The cookie now belongs to this user only — any stored info from an
         earlier session must go before the session is read again. */
      resetStoredAuth();
      const user = await refreshCurrentUser();
      if (!user) throw new Error("Could not create a session. Try again.");

      toast.success("Login successful!");
      router.push(redirect);
    } catch (error) {
      toast.error(mapAuthError(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirect,
      });
      if (error) {
        toast.error(mapAuthError(error));
        setGoogleLoading(false);
      }
      /* The browser is redirected to Google by the BetterAuth client. */
    } catch {
      toast.error("Google login is temporarily unavailable. Try again.");
      setGoogleLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome back" description="Log in to join events and manage your activities.">
      <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={googleLoading}>
        {googleLoading ? <LoaderCircle className="animate-spin" /> : <GoogleIcon className="size-4" />}
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or continue with email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={setField("email")}
                aria-invalid={Boolean(errors.email)}
                className="pl-9"
              />
            </div>
            {errors.email ? <p className="text-destructive text-xs">{errors.email}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={setField("password")}
                aria-invalid={Boolean(errors.password)}
                className="pr-10 pl-9"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-1 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password ? <p className="text-destructive text-xs">{errors.password}</p> : null}
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <LoaderCircle className="animate-spin" /> : null}
            {submitting ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        New to Sebak?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LoginInner />
    </Suspense>
  );
}

function PageLoader() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <HeartHandshake className="text-primary size-10 animate-pulse" />
    </div>
  );
}
