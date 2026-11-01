import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";

/* Single event card reused on the home and upcoming events pages. */
export default function EventCard({ event }) {
  return (
    <Link
      href={`/events/${event._id}`}
      aria-label={`View event: ${event.title}`}
      className="group bg-card hover:border-primary/40 block h-full overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail}
          alt={`Thumbnail of the event ${event.title}`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge
          variant="secondary"
          className="bg-accent text-accent-foreground absolute top-3 left-3 shadow-sm"
        >
          {event.type}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-muted-foreground group-hover:text-foreground line-clamp-2 text-lg font-semibold tracking-tight transition-colors">
          {event.title}
        </h3>

        <div className="text-muted-foreground mt-3 flex flex-col gap-1.5 text-sm">
          <span className="flex items-center gap-2">
            <CalendarDays className="text-primary size-4 shrink-0" />
            {formatDate(event.date)}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="text-primary size-4 shrink-0" />
            <span className="truncate">{event.location}</span>
          </span>
        </div>

        <div className="border-border mt-4 flex border-t pt-4">
          <span className="bg-primary text-primary-foreground group-hover:bg-primary/90 flex w-full items-center justify-center gap-1.5 rounded-md px-4 py-2 text-center text-sm font-medium transition-colors duration-150">
            View Event
            <ArrowRight className="transition-transform duration-150 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
