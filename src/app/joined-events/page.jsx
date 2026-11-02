"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarDays, CalendarCheck, MapPin } from "lucide-react";
import EventPageHeader from "@/components/event-page-header";
import { JoinedRowSkeleton } from "@/components/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/lib/use-require-auth";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";

/* Private page: shows every event the logged-in user joined, ordered by date. */
export default function JoinedEventsPage() {
  const { user, loading } = useRequireAuth();
  const [joins, setJoins] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    api
      .get("/joins/me")
      .then((response) => {
        if (!active) return;
        setJoins(response.data?.data || response.data || []);
      })
      .catch(() => {
        if (!active) return;
        setFailed(true);
        toast.error("Could not load your joined events. Please try again.");
      });

    return () => {
      active = false;
    };
  }, []);

  const rows = (joins || [])
    .map((join) => ({
      ...join,
      event: join.event ||
        join.eventInfo ||
        (typeof join.eventId === "object" ? join.eventId : null) ||
        {},
    }))
    /* Keep the soonest events on top like a real volunteer calendar. */
    .sort(
      (a, b) =>
        new Date(a.event?.date || a.eventDate || 0).getTime() -
        new Date(b.event?.date || b.eventDate || 0).getTime()
    );

  const dataLoading = (loading || joins === null) && !failed;

  return (
    <section className="container-wide py-8 sm:py-10 md:py-16">
      <EventPageHeader
        title="Joined Events"
        description="Events you signed up for as a volunteer, sorted by event date."
        count={dataLoading ? null : rows.length}
      />

      {dataLoading ? (
        <JoinedRowSkeleton count={4} />
      ) : failed ? (
        <div className="mx-auto max-w-md py-16 text-center">
          <p className="text-muted-foreground">Something went wrong while loading your events.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      ) : rows.length === 0 ? (
        <div className="mx-auto max-w-md py-16 text-center">
          <span className="bg-primary/10 text-primary mx-auto inline-flex size-14 items-center justify-center rounded-2xl">
            <CalendarCheck className="size-7" />
          </span>
          <p className="font-heading mt-4 text-lg font-semibold">
            {user?.name ? `${user.name.split(" ")[0]}, you have not joined anything yet` : "No joined events yet"}
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Your first community event is waiting on the Upcoming Events page.
          </p>
          <Button asChild className="mt-5">
            <Link href="/upcoming-events">Browse upcoming events</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {rows.map((join, index) => {
            /* Some stacked data lives on the join record, some comes back
               populated as a nested event object — accept both shapes. */
            const eventId =
              typeof join.eventId === "object" ? join.eventId?._id || join.event?._id : join.eventId;
            const title = join.event?.title || join.eventTitle || "Community event";
            const date = join.event?.date || join.eventDate;
            const location = join.event?.location || join.eventLocation;
            const type = join.event?.type || join.eventType;
            const thumbnail = join.event?.thumbnail || join.eventThumbnail;

            return (
              <Link
                key={join._id || `${eventId}-${index}`}
                href={`/events/${eventId}`}
                className="group bg-card hover:border-primary/40 flex min-w-0 items-center gap-3 overflow-hidden rounded-xl border p-3 shadow-sm transition-all hover:shadow-md sm:gap-4"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnail}
                    alt={`Thumbnail of the event ${title}`}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {type ? (
                      <Badge variant="secondary" className="bg-accent text-accent-foreground">
                        {type}
                      </Badge>
                    ) : null}
                  </div>
                  <h3 className="font-heading mt-1.5 line-clamp-2 text-sm font-semibold tracking-tight sm:text-base">
                    {title}
                  </h3>
                  <p className="text-muted-foreground mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="text-primary size-3.5" />
                      {formatDate(date)}
                    </span>
                    {location ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="text-primary size-3.5" />
                        <span className="min-w-0 truncate">{location}</span>
                      </span>
                    ) : null}
                  </p>
                </div>

                <span className="text-muted-foreground hidden text-xs sm:block">
                  {join.joinedAt ? `Joined ${formatDate(join.joinedAt)}` : null}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
