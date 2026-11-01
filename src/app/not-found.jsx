import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-wide flex min-h-[70vh] flex-col items-center justify-center text-center">
      <span className="bg-primary/10 text-primary inline-flex size-14 items-center justify-center rounded-2xl">
        <Compass className="size-7" />
      </span>
      <p className="font-heading text-primary mt-6 text-6xl font-bold">404</p>
      <h1 className="font-heading mt-2 text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        The page you are looking for does not exist or may have been moved to another route.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
