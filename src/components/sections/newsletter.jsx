"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidEmail } from "@/lib/validate";

/* Design only section — no subscription logic required yet. */
export default function Newsletter() {
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address to subscribe.");
      return;
    }
    toast.success("Thanks for subscribing! See you in the next newsletter.");
    setEmail("");
  }

  return (
    <section className="py-12 sm:py-16 md:py-24">
      <div className="container-wide">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 px-4 py-10 text-center sm:rounded-3xl sm:px-6 md:px-12 md:py-16">
          <span
            aria-hidden="true"
            className="absolute -top-12 -left-12 size-48 rounded-full bg-white/10 blur-3xl"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-16 -right-10 size-56 rounded-full bg-teal-400/20 blur-3xl"
          />

          <h2 className="font-heading relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Stay in the loop
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-teal-50/90">
            Get notified about upcoming drives and volunteer stories. No spam — just good news,
            once a month.
          </p>

          <form onSubmit={handleSubmit} className="relative mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email address for the newsletter"
              className="h-11 flex-1 border-white/30 bg-white/15 text-white placeholder:text-teal-100/70 focus-visible:border-white focus-visible:ring-white/30"
            />
            <Button type="submit" size="lg" className="bg-white text-teal-900 shadow hover:bg-teal-50 hover:text-teal-950">
              Subscribe
              <Send />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
