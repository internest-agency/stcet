"use client";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

const eligibility = [
  ["General (OC)", "45%"],
  ["BC / BCM", "40%"],
  ["MBC & DNC", "40%"],
  ["SC / SCA / ST", "40%"],
];

export default function AcademicEligibility() {
  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
          <div>
            <div className="mb-5 flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-800/50">
                Academic Eligibility
              </span>
            </div>

            <SectionHeading as="h2">
              Minimum Mark Requirements (PCM Average)
            </SectionHeading>
            <p className="mt-5 max-w-lg text-gray-800">
              This applies to both TNEA through Counselling and Management
              Quota.
            </p>
          </div>

          <div className="overflow-hidden border border-primary-800/10">
            <div className="grid grid-cols-[1fr_150px] bg-primary-800 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.08em] text-white sm:grid-cols-[1fr_180px]">
              <span>Category</span>
              <span className="text-right">PCM Average</span>
            </div>

            {eligibility.map(([category, marks]) => (
              <div
                key={category}
                className="grid grid-cols-[1fr_150px] border-t border-primary-800/10 px-5 py-5 text-[13px] sm:grid-cols-[1fr_180px]"
              >
                <span className="text-gray-700">{category}</span>

                <span className="text-right font-bold text-primary-800">
                  {marks}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
