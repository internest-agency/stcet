import type { Metadata } from "next";
import GalleryGrid from "@/src/components/sections/gallery/GalleryGrid";
import Breadcrumb from "@/src/components/ui/Breadcrumb";
import EditorialHero from "@/src/components/ui/EditorialHero";
import SectionHeading from "@/src/components/ui/SectionHeading";
import { getPublicGalleryData } from "@/src/lib/queries/gallery";

export const metadata: Metadata = {
  title: "Campus Gallery | S. Thangapazham College of Engineering & Technology",
  description:
    "Explore photo highlights of the STCET engineering campus, academic departments, laboratories, hostels, and modern infrastructure.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Campus Gallery | STCET",
    description:
      "Explore photo highlights of the STCET engineering campus, academic departments, laboratories, hostels, and modern infrastructure.",
    images: ["/images/gallery/stcet-engineering-block-entrance.jpg"],
  },
};

export default async function GalleryPage() {
  const gallery = await getPublicGalleryData();

  return (
    <>
      <EditorialHero
        image="/images/gallery/stcet-engineering-block-entrance.jpg"
        imageAlt="S. Thangapazham College of Engineering & Technology campus"
      >
        <Breadcrumb
          items={[{ label: "Campus" }, { label: "Gallery" }]}
          className="mb-8 text-white"
        />

        <SectionHeading as="h1" className="text-white">
          Campus <span className="text-accent-400">Gallery</span>
        </SectionHeading>

        <p className="mt-7 max-w-xl text-lg leading-relaxed text-gray-200">
          Explore the campus, learning spaces and student facilities that shape
          everyday life at S. Thangapazham College of Engineering & Technology.
        </p>
      </EditorialHero>
      <GalleryGrid items={gallery.items} categories={gallery.categories} />
    </>
  );
}
