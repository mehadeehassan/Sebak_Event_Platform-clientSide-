import { Badge } from "@/components/ui/badge";

/* Shared page intro for the events list pages. */
export default function EventPageHeader({ title, description, count }) {
  return (
    <div className="mb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {typeof count === "number" ? (
          <Badge variant="secondary" className="text-xs">
            {count} {count === 1 ? "event" : "events"}
          </Badge>
        ) : null}
      </div>
      {description ? (
        <p className="text-muted-foreground mt-2 max-w-2xl leading-relaxed">{description}</p>
      ) : null}
    </div>
  );
}
