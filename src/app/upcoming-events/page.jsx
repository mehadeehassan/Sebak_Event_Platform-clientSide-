"use client";

import { useEffect, useState } from "react";
import { CalendarSearch, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import EventCard from "@/components/event-card";
import EventPageHeader from "@/components/event-page-header";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { startOfToday } from "@/lib/validate";

/* Public page listing everything that has not happened yet. */
export default function UpcomingEventsPage() {
  const [events, setEvents] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    api
      .get("/events")
      .then((response) => {
        if (!active) return;
        setEvents(response.data?.data || response.data || []);
      })
      .catch(() => {
        if (!active) return;
        setFailed(true);
        toast.error("Could not load the events. Please check your connection.");
      });

    return () => {
      active = false;
    };
  }, []);

  const loading = events === null && !failed;

  /* The database can also filter, but the browser never lets an expired
     event slip through even if the API response changes later. */
  const upcoming = (events || [])
    .filter((event) => new Date(event.date).getTime() >= startOfToday().getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <section className="container-wide py-12 md:py-16">
      <EventPageHeader
        title="Upcoming Events"
        description="Every published event that is still looking for volunteers. Pick one close to your heart and show up."
        count={loading ? null : upcoming.length}
      />

      {loading ? (
        <LoadingState />
      ) : failed ? (
        <ErrorState />
      ) : upcoming.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}

function LoadingState() {
  return (
    <p className="text-muted-foreground py-16 text-center text-sm">Loading events...</p>
  );
}

function ErrorState() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="text-muted-foreground">Something went wrong while loading the events.</p>
      <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
        <RotateCcw />
        Try again
      </Button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <span className="bg-primary/10 text-primary mx-auto inline-flex size-14 items-center justify-center rounded-2xl">
        <CalendarSearch className="size-7" />
      </span>
      <p className="font-heading mt-4 text-lg font-semibold">No upcoming events right now</p>
      <p className="text-muted-foreground mt-2 text-sm">
        They will appear here as soon as community members publish one.
      </p>
      <Button asChild className="mt-5">
        <a href="/create-event">Create the first event</a>
      </Button>
    </div>
  );
}
