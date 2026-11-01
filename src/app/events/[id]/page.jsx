"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  CalendarDays,
  CircleCheck,
  Handshake,
  LoaderCircle,
  MapPin,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";

/* This page is public: anyone can read the event, but joining needs an account. */
export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params?.id;
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [event, setEvent] = useState(null);
  const [failed, setFailed] = useState(false);
  const [joined, setJoined] = useState(false);
  const [joinBusy, setJoinBusy] = useState(false);

  /* Load the event details. */
  useEffect(() => {
    let active = true;

    api
      .get(`/events/${eventId}`)
      .then((response) => {
        if (!active) return;
        setEvent(response.data?.data || response.data || null);
      })
      .catch(() => {
        if (!active) return;
        setFailed(true);
      });

    return () => {
      active = false;
    };
  }, [eventId]);

  /* Mark the button as already joined if the session has a matching record. */
  useEffect(() => {
    if (!isLoggedIn || !eventId) return;
    let active = true;

    api
      .get("/joins/me")
      .then((response) => {
        if (!active) return;
        const items = response.data?.data || response.data || [];
        const matched = items.some((item) => {
          const id = typeof item.eventId === "object" ? item.eventId?._id : item.eventId;
          return String(id) === String(eventId);
        });
        if (matched) setJoined(true);
      })
      .catch(() => {
        /* A failed check simply leaves the button in its default state. */
      });

    return () => {
      active = false;
    };
  }, [isLoggedIn, eventId]);

  /* Viewing details is open to everyone, joining needs a login. */
  async function handleJoin() {
    if (!isLoggedIn) {
      toast.info("Please log in to join this event.");
      router.push(`/login?redirect=${encodeURIComponent(`/events/${eventId}`)}`);
      return;
    }

    setJoinBusy(true);
    try {
      await api.post("/joins", { eventId });
      setJoined(true);
      await Swal.fire({
        title: "You are in!",
        text: `Your volunteer spot for "${event?.title}" is confirmed.`,
        icon: "success",
        confirmButtonColor: "#0d9488",
        confirmButtonText: "Great",
      });
    } catch (error) {
      const status = error?.response?.status;
      if (status === 409) {
        setJoined(true);
        toast.info("You already joined this event.");
      } else if (status !== 401) {
        /* 401 already triggers a session-expired toast in the axios layer. */
        toast.error("Could not join this event. Please try again.");
      }
    } finally {
      setJoinBusy(false);
    }
  }

  return (
    <section className="container-wide py-10 md:py-14">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/upcoming-events">
          <ArrowLeft />
          Back to events
        </Link>
      </Button>

      {failed ? (
        <div className="mx-auto max-w-md py-20 text-center">
          <p className="font-heading text-lg font-semibold">This event is not available</p>
          <p className="text-muted-foreground mt-2 text-sm">
            It may have been removed by its organizer or the link is wrong.
          </p>
        </div>
      ) : !event ? (
        <p className="text-muted-foreground py-16 text-center text-sm">Loading event...</p>
      ) : (
        <article className="bg-card mt-6 overflow-hidden rounded-2xl border shadow-sm">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-64 overflow-hidden bg-muted md:min-h-[26rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.thumbnail}
                alt={`Thumbnail of the event ${event.title}`}
                className="absolute inset-0 size-full object-cover"
              />
              <Badge
                variant="secondary"
                className="bg-accent text-accent-foreground absolute top-4 left-4 shadow-sm"
              >
                {event.type}
              </Badge>
            </div>

            <div className="flex flex-col gap-4 p-6 md:p-8">
              <div>
                <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                  {event.title}
                </h1>
                <p className="text-muted-foreground mt-2 text-sm">
                  {typeof event.participantCount === "number" ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="text-primary size-4" />
                      {event.participantCount} volunteers joined
                    </span>
                  ) : (
                    "Organized by a community volunteer on Sebak"
                  )}
                </p>
              </div>

              <dl className="text-muted-foreground grid gap-2.5 text-sm">
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="text-primary size-4 shrink-0" />
                  <dt className="sr-only">Event date</dt>
                  <dd>{formatDate(event.date)}</dd>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="text-primary size-4 shrink-0" />
                  <dt className="sr-only">Location</dt>
                  <dd>{event.location}</dd>
                </div>
              </dl>

              <div>
                <h2 className="font-heading text-sm font-semibold tracking-wide uppercase">
                  About this event
                </h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              <div className="border-border mt-auto border-t pt-5">
                {joined ? (
                  <Button variant="secondary" size="lg" className="w-full cursor-default" disabled>
                    <CircleCheck />
                    Joined
                  </Button>
                ) : (
                  <Button size="lg" className="w-full" onClick={handleJoin} disabled={joinBusy}>
                    {joinBusy ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <Handshake />
                    )}
                    {joinBusy ? "Joining..." : "Join Event"}
                  </Button>
                )}
                {!isLoggedIn ? (
                  <p className="text-muted-foreground mt-2 text-center text-xs">
                    Joining is free — you will be asked to log in first.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}
