"use client";

import Image from "next/image";
import Container from "@/src/components/ui/Container";
import RichText from "@/src/components/ui/RichText";
import Button from "../../ui/Button";
import { BsArrowRightCircleFill } from "react-icons/bs";
import SectionHeading from "../../ui/SectionHeading";

export type ManagementQuotaData = {
  title: string;
  description?: string | null;
  eligibility?: string | null;
};

interface ManagementQuotaProps {
  quotaInfo?: ManagementQuotaData | null;
}

export default function ManagementQuota({
  quotaInfo,
}: ManagementQuotaProps = {}) {
  const title = quotaInfo?.title || "Direct Admission Through Management Quota";
  const description =
    quotaInfo?.description ||
    "Eligible candidates may also apply under the Management Quota as per Government and AICTE regulations.";

  return (
    <section
      id="management-quota"
      className="overflow-hidden bg-gray-50 py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <div className="grid items-stretch lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col justify-center items-start">
            <div className="mb-5 flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-800/50">
                Management Quota
              </span>
            </div>

            <SectionHeading as="h2">{title}</SectionHeading>

            <p className="mt-6 max-w-lg text-gray-800 mb-6">{description}</p>

            {quotaInfo?.eligibility && (
              <div className="mb-8 rounded-lg border border-primary-100 bg-primary-50/50 p-4 text-xs leading-relaxed text-primary-900">
                <strong className="block mb-1 uppercase tracking-wider text-[11px] text-primary-800">
                  Eligibility Criteria
                </strong>
                <RichText html={quotaInfo.eligibility} />
              </div>
            )}

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
