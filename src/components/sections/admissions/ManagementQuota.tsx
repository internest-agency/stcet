"use client";

import Image from "next/image";
import Container from "@/src/components/ui/Container";
import Button from "../../ui/Button";
import { BsArrowRightCircleFill } from "react-icons/bs";
import SectionHeading from "../../ui/SectionHeading";

export default function ManagementQuota() {
  return (
    <section
      id="management-quota"
      className="overflow-hidden bg-gray-50 py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <div className="grid items-stretch lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col justify-center items-start bg-white">
            <div className="mb-5 flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-800/50">
                Management Quota
              </span>
            </div>

            <SectionHeading as="h2">
              Direct Admission Through Management Quota
            </SectionHeading>

            <p className="mt-6 max-w-lg text-gray-800 mb-10">
              Eligible candidates may also apply under the Management Quota as
              per Government and AICTE regulations.
            </p>

            <Button
              href={"/enquire-now"}
              variant="primary"
              size="md"
              rightIcon={<BsArrowRightCircleFill />}
            >
              Enquire Now
            </Button>
          </div>

          <div className="relative min-h-[430px]">
            <Image
              src="/images/admissions/management-admission.webp"
              alt="Students at STCET"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
