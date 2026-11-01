"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarSearch } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import EventCard from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { startOfToday } from "@/lib/validate";

/* Pulls the 6 soonest upcoming events created by the community.
   The database applies its limit here; the client kept the section in sync. */
export default function RecentEvents() {
  const [events, setEvents] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    api
      .get("/events", { params: { limit: 6 } })
      .then((response) => {
        if (!active) return;
        setEvents(response.data?.data || response.data || []);
      })
      .catch(() => {
        if (!active) return;
        setFailed(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const loading = events === null && !failed;

  const upcoming = (events || [])
    .filter((event) => new Date(event.date).getTime() >= startOfToday().getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <section className="py-16 md:py-24">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Come along"
          title="Recent upcoming events"
          description="The six events starting first. Created by community members, open to everybody."
        />

        {loading ? (
          <p className="text-muted-foreground py-10 text-center text-sm">Loading events...</p>
        ) : failed ? (
          <p className="text-muted-foreground py-10 text-center text-sm">
            Events could not be loaded right now — please try again later.
          </p>
        ) : upcoming.length === 0 ? (
          <div className="py-10 text-center">
            <span className="bg-primary/10 text-primary mx-auto inline-flex size-14 items-center justify-center rounded-2xl">
              <CalendarSearch className="size-7" />
            </span>
            <p className="font-heading mt-4 text-lg font-semibold">Nothing scheduled yet</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Be the first to put a social drive on the calendar.
            </p>
            <Button asChild className="mt-5">
              <Link href="/create-event">Create an event</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button variant="outline" asChild>
                <Link href="/upcoming-events">See all upcoming events</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
