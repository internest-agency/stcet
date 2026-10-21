import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Globe, MapPin, Ticket } from "lucide-react";

import Breadcrumb from "@/src/components/ui/Breadcrumb";
import Button from "@/src/components/ui/Button";
import Container from "@/src/components/ui/Container";
import RichText from "@/src/components/ui/RichText";
import { toPlainText } from "@/src/lib/content/html";
import {
  formatEventDateLong,
  formatEventDateRange,
  formatEventTimeRange,
  toSchemaDate,
} from "@/src/lib/events/datetime";
import { getPublishedEventBySlug } from "@/src/lib/queries/events";
import { getSiteUrl } from "@/src/lib/site-url";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

function metaDescription(
  shortDescription: string | null,
  description: string | null,
  title: string,
) {
  const source =
    shortDescription?.trim() ||
    toPlainText(description) ||
    `Event details for ${title} at S. Thangapazham College of Engineering & Technology.`;
  return source.length > 160 ? `${source.slice(0, 157)}…` : source;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found | STCET",
      robots: { index: false, follow: false },
    };
  }

  const title = `${event.title} | STCET`;
  const description = metaDescription(
    event.shortDescription,
    event.description,
    event.title,
  );

  return {
    title,
    description,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      title: event.title,
      description,
      ...(event.imagePath ? { images: [event.imagePath] } : {}),
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getPublishedEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const isSingleDay = !event.endDate || event.endDate === event.startDate;
  const dateLabel = isSingleDay
    ? formatEventDateLong(event.startDate)
    : formatEventDateRange(event.startDate, event.endDate);
  const timeLabel = formatEventTimeRange(
    event.startTime,
    event.endTime,
    event.isAllDay,
  );
  const siteUrl = getSiteUrl();

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: toSchemaDate(event.startDate, event.startTime, event.isAllDay),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(event.endDate
      ? { endDate: toSchemaDate(event.endDate, event.endTime, event.isAllDay) }
      : {}),
    ...(event.imagePath ? { image: [`${siteUrl}${event.imagePath}`] } : {}),
    ...(event.shortDescription || event.description
      ? {
          description: event.shortDescription || toPlainText(event.description),
        }
      : {}),
    ...(event.venue
      ? {
          location: {
            "@type": "Place",
            name: event.venue,
            ...(event.locationDetails
              ? { address: event.locationDetails }
              : {}),
          },
        }
      : {}),
    ...(event.registrationUrl || event.websiteUrl
      ? { url: event.registrationUrl || event.websiteUrl }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative overflow-hidden bg-primary-800 text-white">
        <Container>
          <div className="max-w-3xl py-16 sm:py-20">
            <div className="mb-6">
              <Breadcrumb
                items={[{ label: "Events", href: "/events" }, { label: event.title }]}
              />
            </div>

            {event.category ? (
              <span className="mb-5 inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                {event.category}
              </span>
            ) : null}

            <h1 className="text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {event.title}
            </h1>

            {event.shortDescription ? (
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                {event.shortDescription}
              </p>
            ) : null}

            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <CalendarDays aria-hidden className="size-4 text-accent-400" />
                <dt className="sr-only">Date</dt>
                <dd>{dateLabel}</dd>
              </div>
              {timeLabel ? (
                <div className="flex items-center gap-2">
                  <Clock aria-hidden className="size-4 text-accent-400" />
                  <dt className="sr-only">Time</dt>
                  <dd>{timeLabel}</dd>
                </div>
              ) : null}
              {event.venue ? (
                <div className="flex items-center gap-2">
                  <MapPin aria-hidden className="size-4 text-accent-400" />
                  <dt className="sr-only">Venue</dt>
                  <dd>{event.venue}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-12 sm:py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div>
              {event.imagePath ? (
                <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    alt={event.imageAlt || event.title}
                    className="object-cover"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    src={event.imagePath}
                  />
                </div>
              ) : null}

              {event.description ? (
                <RichText
                  className="max-w-none text-base leading-7 text-gray-700"
                  html={event.description}
                />
              ) : (
                !event.shortDescription && (
                  <p className="text-base leading-7 text-gray-700">
                    Details for this event will be announced soon.
                  </p>
                )
              )}

              <Link
                className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-900"
                href="/events"
              >
                <ArrowLeft aria-hidden className="size-4" />
                Back to all events
              </Link>
            </div>

            <aside className="lg:pt-1">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                  Event details
                </h2>

                <dl className="mt-4 space-y-4 text-sm">
                  <div className="flex gap-3">
                    <CalendarDays
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-primary-700"
                    />
                    <div>
                      <dt className="font-semibold text-gray-900">Date</dt>
                      <dd className="text-gray-600">{dateLabel}</dd>
                    </div>
                  </div>

                  {timeLabel ? (
                    <div className="flex gap-3">
                      <Clock
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-primary-700"
                      />
                      <div>
                        <dt className="font-semibold text-gray-900">Time</dt>
                        <dd className="text-gray-600">{timeLabel}</dd>
                      </div>
                    </div>
                  ) : null}

                  {event.venue || event.locationDetails ? (
                    <div className="flex gap-3">
                      <MapPin
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-primary-700"
                      />
                      <div>
                        <dt className="font-semibold text-gray-900">Venue</dt>
                        {event.venue ? (
                          <dd className="text-gray-600">{event.venue}</dd>
                        ) : null}
                        {event.locationDetails ? (
                          <dd className="mt-1 whitespace-pre-line text-gray-600">
                            {event.locationDetails}
                          </dd>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </dl>

                {event.registrationUrl || event.websiteUrl ? (
                  <div className="mt-6 flex flex-col gap-3">
                    {event.registrationUrl ? (
                      <Button
                        as="link"
                        href={event.registrationUrl}
                        leftIcon={<Ticket aria-hidden className="size-4" />}
                        rel="noreferrer"
                        target="_blank"
                        variant="accent"
                      >
                        Register
                      </Button>
                    ) : null}
                    {event.websiteUrl ? (
                      <Button
                        as="link"
                        href={event.websiteUrl}
                        leftIcon={<Globe aria-hidden className="size-4" />}
                        rel="noreferrer"
                        target="_blank"
                        variant="primary"
                      >
                        Event website
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
