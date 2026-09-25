"use client";

import Link from "next/link";
import { ExternalLink, Info } from "lucide-react";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

export default function ImportantInformation() {
  return (
    <section className="overflow-hidden bg-gray-50 py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mb-10">
          <div className="mb-5 flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-800/50">
              Important Information
            </span>
          </div>

          <SectionHeading as="h2">Important Before You Apply</SectionHeading>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="flex items-center gap-5 bg-blue-50 p-7 sm:p-9">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-blue-600">
              <Info size={21} />
            </div>

            <div>
              <p className="font-bold leading-6 text-primary-800">
                Tamil Nadu native candidates alone will be considered for
                communal reservation.
              </p>
            </div>
          </div>

          <Link
            href="https://static.tneaonline.org/docs/2_Information_Brochure_2026.pdf"
            target="_blank"
            className="group flex items-center justify-between gap-6 bg-white p-7 shadow-sm sm:p-9"
          >
            <div>
              <p className="text-[10px] mb-4 font-bold uppercase tracking-[0.16em] text-primary-800/45">
                Official Document
              </p>

              <SectionHeading as="h3">
                TNEA Information Brochure 2026
              </SectionHeading>

              <p className="mt-2 text-[14px] text-gray-500">
                View and download the official TNEA information brochure.
              </p>
            </div>

            <ExternalLink
              size={20}
              className="shrink-0 text-primary-800 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}
