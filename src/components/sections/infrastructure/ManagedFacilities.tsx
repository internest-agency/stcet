import Image from "next/image";
import type { InfrastructureFacility } from "@/src/generated/prisma/client";
import Container from "@/src/components/ui/Container";
import RichText from "@/src/components/ui/RichText";

const FACILITY_LAYOUTS = [
  "image-left",
  "image-right",
  "image-top",
  "full-width",
  "image-banner",
  "highlight",
  "two-columns",
  "overlay-card",
  "student-facility-grid",
] as const;

type FacilityLayout = (typeof FACILITY_LAYOUTS)[number];

function getFacilityLayout(layout: string | null): FacilityLayout {
  return FACILITY_LAYOUTS.includes(layout as FacilityLayout)
    ? (layout as FacilityLayout)
    : "image-top";
}

function FacilityImage({
  facility,
  className,
  fill = false,
}: {
  facility: InfrastructureFacility;
  className: string;
  fill?: boolean;
}) {
  if (!facility.imagePath) {
    return (
      <div
        aria-label={`${facility.title} image unavailable`}
        className={`${fill ? className : `relative overflow-hidden ${className}`} bg-primary-50`}
        role="img"
      />
    );
  }

  return (
    <div className={fill ? className : `relative overflow-hidden ${className}`}>
      <Image
        alt={facility.title}
        className={fill ? "object-cover" : "h-full w-full object-cover"}
        fill={fill}
        height={fill ? undefined : 420}
        src={facility.imagePath}
        unoptimized
        width={fill ? undefined : 720}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}

function FacilityCopy({
  facility,
  className = "",
}: {
  facility: InfrastructureFacility;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-xl font-bold leading-tight text-primary-700 sm:text-2xl">
        {facility.title}
      </h3>
      {facility.description ? (
        <RichText
          className="mt-3 text-sm leading-7 text-gray-600"
          html={facility.description}
        />
      ) : null}
    </div>
  );
}

function FacilityPresentation({
  facility,
}: {
  facility: InfrastructureFacility;
}) {
  const layout = getFacilityLayout(facility.layout);
  const sequence = String(facility.sortOrder + 1).padStart(2, "0");

  if (layout === "image-left" || layout === "image-right") {
    const imageFirst = layout === "image-left";
    return (
      <article className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
        <FacilityImage
          className={`aspect-[4/3] ${imageFirst ? "lg:order-1" : "lg:order-2"}`}
          facility={facility}
        />
        <div className={imageFirst ? "lg:order-2" : "lg:order-1"}>
          <p className="mb-3 text-sm font-bold tracking-[0.18em] text-accent-600">
            {sequence}
          </p>
          <FacilityCopy facility={facility} />
        </div>
      </article>
    );
  }

  if (layout === "image-banner") {
    return (
      <article>
        <div className="relative aspect-[21/7] min-h-56 overflow-hidden bg-primary-900">
          <FacilityImage
            className="absolute inset-0 h-full w-full"
            facility={facility}
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
            <p className="mb-2 text-sm font-bold tracking-[0.18em] text-accent-400">
              {sequence}
            </p>
            <h3 className="text-2xl font-bold uppercase sm:text-3xl">
              {facility.title}
            </h3>
          </div>
        </div>
        {facility.description ? (
          <RichText
            className="mt-5 max-w-4xl text-sm leading-7 text-gray-600"
            html={facility.description}
          />
        ) : null}
      </article>
    );
  }

  if (layout === "overlay-card") {
    return (
      <article className="relative isolate flex min-h-[22rem] items-end overflow-hidden bg-primary-900 text-white">
        {facility.imagePath ? (
          <FacilityImage
            className="absolute inset-0 -z-20 h-full w-full"
            facility={facility}
            fill
          />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary-950/95 via-primary-950/35 to-transparent" />
        <div className="p-6 sm:p-8">
          <p className="mb-2 font-bold tracking-[0.18em] text-accent-400">
            {sequence}
          </p>
          <h3 className="text-2xl font-bold uppercase">{facility.title}</h3>
          {facility.description ? (
            <RichText
              className="mt-3 max-w-2xl text-sm leading-7 text-white/85"
              html={facility.description}
            />
          ) : null}
        </div>
      </article>
    );
  }

  if (layout === "highlight") {
    return (
      <article className="grid gap-6 border-l-4 border-accent-500 bg-primary-50 p-5 sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-10">
        {facility.imagePath ? (
          <FacilityImage className="aspect-[4/3]" facility={facility} />
        ) : null}
        <div>
          <p className="mb-3 text-sm font-bold tracking-[0.18em] text-accent-600">
            {sequence}
          </p>
          <FacilityCopy facility={facility} />
        </div>
      </article>
    );
  }

  if (layout === "two-columns") {
    return (
      <article className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        {facility.imagePath ? (
          <FacilityImage className="aspect-[16/9] lg:col-span-2" facility={facility} />
        ) : null}
        <div className={facility.imagePath ? "" : "lg:col-span-2"}>
          <p className="mb-3 text-sm font-bold tracking-[0.18em] text-accent-600">
            {sequence}
          </p>
          <h3 className="text-xl font-bold leading-tight text-primary-700 sm:text-2xl">
            {facility.title}
          </h3>
        </div>
        {facility.description ? (
          <RichText
            className="text-sm leading-7 text-gray-600"
            html={facility.description}
          />
        ) : null}
      </article>
    );
  }

  if (layout === "full-width") {
    return (
      <article className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12">
        {facility.imagePath ? (
          <FacilityImage className="aspect-[16/9]" facility={facility} />
        ) : null}
        <div className={facility.imagePath ? "" : "lg:col-span-2"}>
          <p className="mb-3 text-sm font-bold tracking-[0.18em] text-accent-600">
            {sequence}
          </p>
          <FacilityCopy facility={facility} />
        </div>
      </article>
    );
  }

  if (layout === "student-facility-grid") {
    return (
      <article className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12">
        <div>
          <p className="mb-3 text-sm font-bold tracking-[0.18em] text-accent-600">
            {sequence}
          </p>
          <FacilityCopy facility={facility} />
        </div>
        <FacilityImage className="aspect-[4/3]" facility={facility} />
      </article>
    );
  }

  return (
    <article>
      <FacilityImage className="aspect-[16/9]" facility={facility} />
      <div className="mt-4">
        <p className="mb-2 text-sm font-bold tracking-[0.18em] text-accent-600">
          {sequence}
        </p>
        <FacilityCopy facility={facility} />
      </div>
    </article>
  );
}

export default function ManagedFacilities({
  facilities,
}: {
  facilities: InfrastructureFacility[];
}) {
  if (!facilities.length) return null;

  const groups = Object.groupBy(facilities, (facility) => facility.category);

  return (
    <section className="bg-gray-50 py-14 sm:py-18">
      <Container>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          Campus facilities
        </p>
        {Object.entries(groups).map(([category, items]) => (
          <div className="mt-8" key={category}>
            <h2 className="capitalize text-2xl font-bold text-primary-700">
              {category} facilities
            </h2>
            <div className="mt-6 space-y-10 sm:space-y-14">
              {items?.map((facility) => (
                <FacilityPresentation facility={facility} key={facility.id} />
              ))}
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
