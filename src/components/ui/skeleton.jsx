import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md dark:bg-white/10", className)}
      {...props}
    />
  );
}

export { Skeleton };
