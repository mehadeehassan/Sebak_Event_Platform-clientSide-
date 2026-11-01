"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LoaderCircle, RotateCcw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { EVENT_TYPES, isFutureDate, isValidUrl } from "@/lib/validate";
import { tomorrowInputDate } from "@/lib/format";

/* Same form powers Create Event and Update Event so the rules stay identical. */
export default function EventForm({ mode = "create", initial, submitting, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => ({
    title: initial?.title || "",
    description: initial?.description || "",
    type: initial?.type || "",
    thumbnail: initial?.thumbnail || "",
    location: initial?.location || "",
    date: initial?.date ? initial.date.slice(0, 10) : "",
  }));
  const [errors, setErrors] = useState({});
  const [previewBroken, setPreviewBroken] = useState(false);

  function setField(field) {
    return (event) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      if (field === "thumbnail") setPreviewBroken(false);
    };
  }

  /* Everything about an event is required, and the date must be in the future. */
  function validate() {
    const next = {};
    if (values.title.trim().length < 5) next.title = "Title must be at least 5 characters.";
    if (values.description.trim().length < 20)
      next.description = "Description must be at least 20 characters.";
    if (!values.type) next.type = "Please choose an event type.";
    if (!isValidUrl(values.thumbnail))
      next.thumbnail = "Paste a valid image URL starting with http or https.";
    if (values.location.trim().length < 3)
      next.location = "Location must be at least 3 characters.";
    if (!isFutureDate(values.date)) next.date = "Event date must be in the future.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields before submitting.");
      return;
    }

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      type: values.type,
      thumbnail: values.thumbnail.trim(),
      location: values.location.trim(),
      date: values.date,
    });
  }

  const showPreview = isValidUrl(values.thumbnail) && !previewBroken;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="event-title">Event title</Label>
        <Input
          id="event-title"
          placeholder="Winter Clothes Distribution — Mirpur 10"
          value={values.title}
          onChange={setField("title")}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title ? <p className="text-destructive text-xs">{errors.title}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-description">Description</Label>
        <Textarea
          id="event-description"
          rows={4}
          placeholder="Who should come, what will happen, what to bring..."
          value={values.description}
          onChange={setField("description")}
          aria-invalid={Boolean(errors.description)}
        />
        {errors.description ? (
          <p className="text-destructive text-xs">{errors.description}</p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="event-type">Event type</Label>
          <Select
            id="event-type"
            value={values.type}
            onChange={setField("type")}
            aria-invalid={Boolean(errors.type)}
          >
            <option value="" disabled>
              Select an event type
            </option>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
          {errors.type ? <p className="text-destructive text-xs">{errors.type}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-location">Location</Label>
          <Input
            id="event-location"
            placeholder="Mohammadpur, Dhaka"
            value={values.location}
            onChange={setField("location")}
            aria-invalid={Boolean(errors.location)}
          />
          {errors.location ? <p className="text-destructive text-xs">{errors.location}</p> : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-thumbnail">Thumbnail image URL</Label>
        <Input
          id="event-thumbnail"
          type="url"
          placeholder="https://i.ibb.co/your-image.jpg"
          value={values.thumbnail}
          onChange={setField("thumbnail")}
          aria-invalid={Boolean(errors.thumbnail)}
        />
        {errors.thumbnail ? (
          <p className="text-destructive text-xs">{errors.thumbnail}</p>
        ) : null}
        {showPreview ? (
          <div className="bg-muted overflow-hidden rounded-lg border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={values.thumbnail.trim()}
              alt="Preview of the event thumbnail"
              onError={() => setPreviewBroken(true)}
              className="h-32 w-full object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-date">Event date</Label>
        <Input
          id="event-date"
          type="date"
          min={tomorrowInputDate()}
          value={values.date}
          onChange={setField("date")}
          aria-invalid={Boolean(errors.date)}
        />
        {errors.date ? (
          <p className="text-destructive text-xs">{errors.date}</p>
        ) : (
          <p className="text-muted-foreground text-xs">
            Past dates cannot be used, so volunteers always get time to prepare.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            <RotateCcw />
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={submitting}>
          {submitting ? <LoaderCircle className="animate-spin" /> : <Send />}
          {mode === "update"
            ? submitting
              ? "Saving changes..."
              : "Save changes"
            : submitting
              ? "Publishing..."
              : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
