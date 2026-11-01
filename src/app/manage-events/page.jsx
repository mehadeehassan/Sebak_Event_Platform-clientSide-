"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Swal from "sweetalert2";
import {
  ArrowRight,
  CalendarDays,
  LayoutList,
  LoaderCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import EventPageHeader from "@/components/event-page-header";
import { ManageRowSkeleton } from "@/components/skeletons";
import EventForm from "@/components/event-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRequireAuth } from "@/lib/use-require-auth";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";

/* Private page: full control over the events the logged-in user created. */
export default function ManageEventsPage() {
  const { user, loading } = useRequireAuth();
  const [events, setEvents] = useState(null);
  const [failed, setFailed] = useState(false);

  const [editing, setEditing] = useState(null);
  const [updateSubmitting, setUpdateSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let active = true;

    api
      .get("/events/my")
      .then((response) => {
        if (!active) return;
        setEvents(response.data?.data || response.data || []);
      })
      .catch(() => {
        if (!active) return;
        setFailed(true);
        toast.error("Could not load your events. Please try again.");
      });

    return () => {
      active = false;
    };
  }, []);

  const dataLoading = (loading || events === null) && !failed;

  /* Validation lives inside the shared EventForm, then we patch the changes. */
  async function handleUpdate(payload) {
    if (!editing) return;
    setUpdateSubmitting(true);
    try {
      await api.patch(`/events/${editing._id}`, payload);
      setEvents((current) =>
        current.map((event) => (event._id === editing._id ? { ...event, ...payload } : event))
      );
      toast.success("Event updated successfully");
      setEditing(null);
    } catch (error) {
      if (error?.response?.status !== 401) {
        toast.error("Could not update the event. Please try again.");
      }
    } finally {
      setUpdateSubmitting(false);
    }
  }

  /* A SweetAlert confirmation before the event is deleted for good. */
  async function handleDelete(event) {
    const confirm = await Swal.fire({
      title: "Delete this event?",
      text: `"${event.title}" will be removed permanently and volunteers will lose it.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Keep event",
    });
    if (!confirm.isConfirmed) return;

    setDeletingId(event._id);
    try {
      await api.delete(`/events/${event._id}`);
      setEvents((current) => current.filter((item) => item._id !== event._id));
      toast.success("Event deleted successfully");
    } catch (error) {
      if (error?.response?.status !== 401) {
        toast.error("Could not delete the event. Please try again.");
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="container-wide py-12 md:py-16">
      <EventPageHeader
        title="Manage Events"
        description="Every event created by you, in one place. Update details or remove an event that is no longer happening."
        count={dataLoading ? null : (events || []).length}
      />

      {dataLoading ? (
        <ManageRowSkeleton count={3} />
      ) : failed ? (
        <div className="mx-auto max-w-md py-16 text-center">
          <p className="text-muted-foreground">Something went wrong while loading your events.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      ) : (events || []).length === 0 ? (
        <div className="mx-auto max-w-md py-16 text-center">
          <span className="bg-primary/10 text-primary mx-auto inline-flex size-14 items-center justify-center rounded-2xl">
            <LayoutList className="size-7" />
          </span>
          <p className="font-heading mt-4 text-lg font-semibold">
            {user?.name ? `${user.name.split(" ")[0]}, you have not created any events yet` : "No events created yet"}
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Publish a social development event and it will show up here for management.
          </p>
          <Button asChild className="mt-5">
            <Link href="/create-event">Create an event</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {(events || []).map((event) => (
            <article
              key={event._id}
              className="bg-card hover:border-primary/40 flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md lg:flex-row"
            >
              <div className="bg-muted relative flex">
                <div className="hidden w-56 shrink-0 overflow-hidden sm:block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={event.thumbnail}
                    alt={`Thumbnail of the event ${event.title}`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      {event.type}
                    </Badge>
                    <Badge variant="outline">{formatDate(event.date)}</Badge>
                  </div>
                  <h3 className="font-heading mt-2 line-clamp-1 text-lg font-semibold tracking-tight">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">
                    {event.location}
                  </p>

                  <p className="text-muted-foreground mt-2 line-clamp-2 hidden text-sm leading-relaxed sm:block">
                    {event.description}
                  </p>

                  <div className="border-border mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
                    <Button variant="outline" size="sm" onClick={() => setEditing(event)}>
                      <Pencil />
                      Update
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(event)}
                      disabled={deletingId === event._id}
                    >
                      {deletingId === event._id ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
                      {deletingId === event._id ? "Deleting..." : "Delete"}
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="ml-auto">
                      <Link href={`/events/${event._id}`}>
                        View
                        <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update event</DialogTitle>
            <DialogDescription>
              Save your changes — volunteers always see the latest details.
            </DialogDescription>
          </DialogHeader>
          <EventForm
            key={editing?._id || "form"}
            mode="update"
            initial={editing}
            submitting={updateSubmitting}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
