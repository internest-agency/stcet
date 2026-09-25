import Image from "next/image";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

export default function SeminarSection() {
  return (
    <section className="border-t border-primary-800/10 bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mb-4">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-accent-400" />

            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary-800/45">
              07 — Seminar & Learning Spaces
            </span>
          </div>

          <SectionHeading as="h2">Think. Share. Grow.</SectionHeading>

          <p className="mt-6 max-w-md text-gray-800">
            Seminar and presentation spaces provide a setting for academic
            discussions, workshops, presentations and collaborative activities.
          </p>
        </div>

        <div className="relative aspect-[1.45/0.75] overflow-hidden">
          <Image
            src="/images/infrastructure/seminar.webp"
            alt="Seminar and learning space"
            fill
            sizes="(max-width: 1024px) 100vw, 65vw"
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}
