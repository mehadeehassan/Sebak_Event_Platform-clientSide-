/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
        <Image
          src={src}
          alt={name || "User avatar"}
          onError={() => setBroken(true)}
          fill
          unoptimized
          sizes="36px"
          className="object-cover"
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
