import Link from "next/link";
import { ArrowRight, CalendarPlus, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1920&auto=format&fit=crop";

const stats = [
  { value: "1,200+", label: "Volunteers" },
  { value: "350+", label: "Events organized" },
  { value: "20+", label: "Communities" },
];

/* Company banner of the home page, themed around community service. */
export default function Banner() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGE}
        alt="Volunteers packing relief supplies together"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-teal-950/95 via-teal-900/85 to-teal-900/25" />

      <div className="container-wide py-16 sm:py-20 md:py-28 lg:py-32">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur">
            <HeartHandshake className="size-3.5" />
            Community service network
          </span>

          <h1 className="font-heading mt-5 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Serve your community, one event at a time
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-teal-50/90 sm:text-lg">
            Sebak connects everyday people with social development events around them —
            winter clothes drives, blanket distributions, tree plantations, street cleanups
            and more. Start something good, or join hands in one.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/upcoming-events">
                Browse Events
                <ArrowRight />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="/create-event">
                <CalendarPlus />
                Create an Event
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-2 text-white sm:mt-12 sm:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-center backdrop-blur sm:p-4"
              >
                <p className="font-heading text-lg font-bold sm:text-2xl">{stat.value}</p>
                <p className="mt-1 text-[9px] font-medium tracking-wide text-teal-100/80 uppercase sm:text-[11px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
