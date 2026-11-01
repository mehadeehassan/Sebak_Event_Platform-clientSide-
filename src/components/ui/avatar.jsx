"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/* Profile picture with a initials fallback when the image URL is missing or broken. */
export function Avatar({ src, name = "", className }) {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [src]);

  const initials =
    String(name)
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "U";

  const showImage = Boolean(src) && !broken;

  return (
    <span
      data-slot="avatar"
      className={cn(
        "bg-secondary relative inline-flex size-9 shrink-0 overflow-hidden rounded-full",
        className
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name || "User avatar"}
          onError={() => setBroken(true)}
          className="size-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="text-secondary-foreground flex size-full items-center justify-center text-sm font-semibold"
        >
          {initials}
        </span>
      )}
    </span>
  );
}
