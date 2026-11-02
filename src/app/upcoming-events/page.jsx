"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarSearch, RotateCcw, Search } from "lucide-react";
import { toast } from "sonner";
import EventCard from "@/components/event-card";
import EventPageHeader from "@/components/event-page-header";
import EventTypeNav from "@/components/event-type-nav";
import { EventGridSkeleton } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { api } from "@/lib/api";
import { startOfToday } from "@/lib/validate";

/* Public page listing everything that has not happened yet. */
function UpcomingEventsContent() {
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type") || "";
  const [events, setEvents] = useState(null);
  const [failed, setFailed] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("soonest");

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

  const visibleEvents = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return upcoming
      .filter((event) => !activeType || event.type === activeType)
      .filter((event) => !query || [event.title, event.location, event.description, event.type]
        .some((value) => String(value || "").toLocaleLowerCase().includes(query)))
      .sort((a, b) => {
        if (sort === "latest") return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sort === "title") return a.title.localeCompare(b.title);
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }, [upcoming, activeType, search, sort]);

  return (
    <section className="container-wide py-8 sm:py-10 md:py-16">
      <EventPageHeader
        title="Upcoming Events"
        description="Every published event that is still looking for volunteers. Pick one close to your heart and show up."
        count={loading ? null : visibleEvents.length}
      />

      {!loading && !failed ? (
        <>
          <EventTypeNav events={upcoming} activeType={activeType} />
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search aria-hidden="true" className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events, locations..."
                aria-label="Search upcoming events"
                className="pl-9"
              />
            </div>
            <div className="w-full sm:w-52">
              <Select
                aria-label="Sort upcoming events"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="soonest">Sort: Soonest first</option>
                <option value="latest">Sort: Latest first</option>
                <option value="title">Sort: Title A–Z</option>
              </Select>
            </div>
          </div>
        </>
      ) : null}

      {loading ? (
        <EventGridSkeleton count={6} />
      ) : failed ? (
        <ErrorState />
      ) : visibleEvents.length === 0 ? (
        <EmptyState filtered={Boolean(activeType || search.trim())} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {visibleEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function UpcomingEventsPage() {
  return (
    <Suspense fallback={<section className="container-wide py-12 md:py-16"><EventGridSkeleton count={6} /></section>}>
      <UpcomingEventsContent />
    </Suspense>
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

function EmptyState({ filtered }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <span className="bg-primary/10 text-primary mx-auto inline-flex size-14 items-center justify-center rounded-2xl">
        <CalendarSearch className="size-7" />
      </span>
      <p className="font-heading mt-4 text-lg font-semibold">
        {filtered ? "No events match these filters" : "No upcoming events right now"}
      </p>
      <p className="text-muted-foreground mt-2 text-sm">
        {filtered ? "Try another event type or search phrase." : "They will appear here as soon as community members publish one."}
      </p>
      <Button asChild className="mt-5">
        <a href="/create-event">Create the first event</a>
      </Button>
    </div>
  );
}
