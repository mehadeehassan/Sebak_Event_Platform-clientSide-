"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { CalendarPlus } from "lucide-react";
import EventForm from "@/components/event-form";
import { useRequireAuth } from "@/lib/use-require-auth";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/* Private page: any logged-in user can publish an event for the community. */
export default function CreateEventPage() {
  const router = useRouter();
  const { user, loading } = useRequireAuth();
  const [submitting, setSubmitting] = useState(false);

  /* The verified JWT tells the server who created this event, so the owner
     can later update or delete it from the Manage Events page. */
  async function handleCreate(payload) {
    setSubmitting(true);
    try {
      await api.post("/events", payload);
      await Swal.fire({
        title: "Event created successfully!",
        text: "Volunteers can now find it on the Upcoming Events page.",
        icon: "success",
        confirmButtonColor: "#0d9488",
        confirmButtonText: "See upcoming events",
      });
      router.push("/upcoming-events");
    } catch (error) {
      if (error?.response?.status !== 401) {
        toast.error("Could not create the event. Please try again.");
      }
      setSubmitting(false);
    }
  }

  return (
    <section className="container-wide py-8 sm:py-10 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <span className="bg-primary/10 text-primary mx-auto mb-3 inline-flex size-12 items-center justify-center rounded-2xl">
            <CalendarPlus className="size-6" />
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Create an event
          </h1>
          <p className="text-muted-foreground mt-2">
            Share a social development event and invite volunteers to join hands.
          </p>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Event details</CardTitle>
            <CardDescription>All fields are required.</CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            {loading || !user ? (
              <div className="space-y-4 py-4">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-20 w-full" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            ) : (
              <EventForm
                mode="create"
                submitting={submitting}
                onSubmit={handleCreate}
                onCancel={() => router.push("/upcoming-events")}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
