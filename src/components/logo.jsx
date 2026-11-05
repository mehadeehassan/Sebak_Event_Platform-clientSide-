import Link from "next/link";
import { HandHeart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Logo({ className }) {
  return (
    <Link href="/" aria-label="Sebak - go to home" className={cn("flex items-center gap-2.5", className)}>
      <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg shadow-sm">
        <HandHeart className="size-5" />
      </span>
      <span className="font-heading text-xl font-bold tracking-tight">Sebak</span>
    </Link>
  );
}
