import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

import Container from "@/src/components/ui/Container";
import type { Event } from "@/src/generated/prisma/client";
import {
  formatEventDateRange,
  formatEventTimeRange,
} from "@/src/lib/events/datetime";

function EventCard({ event }: { event: Event }) {
  const time = formatEventTimeRange(event.startTime, event.endTime, event.isAllDay);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:shadow-xl">
      <Link
        className="relative block aspect-[16/10] overflow-hidden bg-primary-900"
        href={`/events/${event.slug}`}
        tabIndex={-1}
      >
        {event.imagePath ? (
          <Image
            alt={event.imageAlt || event.title}
            className="object-cover transition duration-500 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            src={event.imagePath}
          />
        ) : (
          <span className="grid h-full place-items-center text-white/40">
            <CalendarDays aria-hidden className="size-12" />
          </span>
        )}
        {event.category ? (
          <span className="absolute left-3 top-3 rounded-full bg-primary-900/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            {event.category}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-600">
          {formatEventDateRange(event.startDate, event.endDate)}
        </p>
        {time ? <p className="mt-1 text-xs text-gray-500">{time}</p> : null}

        <h3 className="mt-3 text-xl font-bold leading-snug text-gray-900">
          <Link className="hover:text-primary-700" href={`/events/${event.slug}`}>
            {event.title}
          </Link>
        </h3>

        {event.shortDescription ? (
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {event.shortDescription}
          </p>
        ) : null}

        {event.venue ? (
          <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin aria-hidden className="size-3.5 shrink-0" />
            {event.venue}
          </p>
        ) : null}

        <Link
          className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-bold text-primary-700 hover:text-primary-900"
          href={`/events/${event.slug}`}
        >
          View details
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
    </article>
  );
}

export default function EventsList({ events }: { events: Event[] }) {
  return (
    <section className="bg-white">
      <Container className="py-16 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          What&apos;s happening
        </p>
        <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.035em] text-primary-700 sm:text-4xl">
          Upcoming events.
        </h2>

        {events.length === 0 ? (
          <p className="mt-10 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-sm text-gray-500">
            There are no events to show right now. Please check back soon.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard event={event} key={event.id} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
