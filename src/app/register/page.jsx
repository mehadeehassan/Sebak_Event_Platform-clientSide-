"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Eye, EyeOff, LoaderCircle, Lock, Mail, SquarePen, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { resetStoredAuth } from "@/lib/auth-session";
import { mapAuthError } from "@/lib/auth-utils";
import { useAuth } from "@/components/auth-provider";
import { isValidEmail, isValidPassword, isValidUrl } from "@/lib/validate";
import AuthShell from "@/components/auth-shell";

function RegisterInner() {
  const router = useRouter();
  const { refreshCurrentUser } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", photoURL: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function setField(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    };
  }

  function validate() {
    const next = {};
    if (form.name.trim().length < 3) next.name = "Name must be at least 3 characters.";
    if (!isValidEmail(form.email)) next.email = "Please enter a valid email address.";
    if (!isValidUrl(form.photoURL)) next.photoURL = "Enter a valid http/https image URL.";
    if (!isValidPassword(form.password)) {
      next.password =
        "Password needs an uppercase letter, a lowercase letter and at least 6 characters.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields before continuing.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        image: form.photoURL.trim(),
      });
      if (error) throw error;

      resetStoredAuth();
      const user = await refreshCurrentUser();
      if (user) {
        await Swal.fire({
          title: "Welcome to Sebak!",
          text: "Your account has been created successfully.",
          icon: "success",
          confirmButtonColor: "#0d9488",
          confirmButtonText: "Get started",
        });
        router.push("/");
      } else {
        toast.success("Registration successful! Please log in.");
        router.push("/login");
      }
    } catch (error) {
      toast.error(mapAuthError(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell title="Create your account" description="Join the community and start serving events.">
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <SquarePen className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                id="name"
                autoComplete="name"
                placeholder="Rahim Ahmed"
                value={form.name}
                onChange={setField("name")}
                aria-invalid={Boolean(errors.name)}
                className="pl-9"
              />
            </div>
            {errors.name ? <p className="text-destructive text-xs">{errors.name}</p> : null}
          </div>

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
            <Label htmlFor="photoURL">Photo URL</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ImagePlus className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  id="photoURL"
                  type="url"
                  autoComplete="photo-URL"
                  placeholder="https://i.ibb.co/your-photo.jpg"
                  value={form.photoURL}
                  onChange={setField("photoURL")}
                  aria-invalid={Boolean(errors.photoURL)}
                  className="pl-9"
                />
              </div>
            </div>
            {errors.photoURL ? <p className="text-destructive text-xs">{errors.photoURL}</p> : null}
            {form.photoURL.includes("https") ? <PhotoPreview url={form.photoURL.trim()} /> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 6 characters"
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
            {errors.password ? (
              <p className="text-destructive text-xs">{errors.password}</p>
            ) : (
              <p className="text-muted-foreground text-xs">
                Must have an uppercase letter, a lowercase letter and 6+ characters.
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <LoaderCircle className="animate-spin" /> : null}
            {submitting ? "Creating account..." : "Create account"}
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}

function PhotoPreview({ url }) {
  return (
    <div className="bg-muted relative h-28 overflow-hidden rounded-lg border">
      <Image
        src={url}
        alt="Preview of your avatar URL"
        fill
        unoptimized
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}

export default function RegisterPage() {
  return <RegisterInner />;
}
