"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { EVENT_TYPES, startOfToday } from "@/lib/validate";


export default function EventTypeNav({ events: suppliedEvents, activeType = "" }) {
  const [loadedEvents, setLoadedEvents] = useState(null);
  const events = suppliedEvents ?? loadedEvents;

  useEffect(() => {
    if (suppliedEvents) return;
    let active = true;
    api.get("/events").then((response) => {
      if (active) setLoadedEvents(response.data?.data || response.data || []);
    }).catch(() => {
      if (active) setLoadedEvents([]);
    });
    return () => { active = false; };
  }, [suppliedEvents]);

  const types = useMemo(() => {
    const available = new Set((events || [])
      .filter((event) => new Date(event.date).getTime() >= startOfToday().getTime())
      .map((event) => event.type)
      .filter(Boolean));
    return [
      ...EVENT_TYPES.filter((type) => available.delete(type)),
      ...[...available].sort((a, b) => a.localeCompare(b)),
    ];
  }, [events]);
  const contentClassName = suppliedEvents
    ? "py-5 sm:py-6"
    : "container-wide py-5 sm:py-6";

  if (events === null || types.length === 0) return null;

  return (
    <nav aria-label="Browse events by type" className="border-b bg-background">
      <div className={contentClassName}>
        <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Browse by event type
        </p>
        <div className="flex flex-wrap gap-2 pb-1">
          <Link
            href="/upcoming-events"
            aria-current={!activeType ? "page" : undefined}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${!activeType ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}`}
          >
            All events
          </Link>
          {types.map((type) => (
            <Link
              key={type}
              href={`/upcoming-events?type=${encodeURIComponent(type)}`}
              aria-current={activeType === type ? "page" : undefined}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${activeType === type ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-accent"}`}
            >
              {type}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
