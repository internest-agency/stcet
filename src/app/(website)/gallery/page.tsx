import GalleryGrid from "@/src/components/sections/gallery/GalleryGrid";
import Breadcrumb from "@/src/components/ui/Breadcrumb";
import EditorialHero from "@/src/components/ui/EditorialHero";
import SectionHeading from "@/src/components/ui/SectionHeading";

export default function GalleryPage() {
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
      <GalleryGrid />
    </>
  );
}
