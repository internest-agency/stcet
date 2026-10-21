import type { Metadata } from "next";

import EventsHero from "@/src/components/sections/events/EventsHero";
import EventsList from "@/src/components/sections/events/EventsList";
import { getPublishedEvents } from "@/src/lib/queries/events";
import { getPageSeo } from "@/src/lib/queries/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/events");
  const title = seo.seoTitle || "Events | STCET";
  const description =
    seo.metaDescription ||
    "Explore upcoming workshops, seminars, cultural programmes and campus activities at S. Thangapazham College of Engineering & Technology.";

  return {
    title,
    description,
    alternates: { canonical: seo.canonicalUrl ?? "/events" },
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      ...(seo.ogImage ? { images: [seo.ogImage] } : {}),
    },
  };
}

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <>
      <EventsHero />
      <EventsList events={events} />
    </>
  );
}
