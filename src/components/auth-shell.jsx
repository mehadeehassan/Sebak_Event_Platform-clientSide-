import { HeartHandshake } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/* Shared centered card layout used by the login and register pages. */
export default function AuthShell({ title, description, children }) {
  return (
    <div className="container-wide flex min-h-[calc(100dvh-8rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md py-8 shadow-md">
        <CardHeader className="items-center text-center">
          <span className="bg-primary/10 text-primary mb-2 inline-flex size-12 items-center justify-center rounded-2xl">
            <HeartHandshake className="size-6" />
          </span>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
