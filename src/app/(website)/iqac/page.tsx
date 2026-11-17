import type { Metadata } from "next";
import InternalQualityAssuranceCell from "@/src/components/sections/iqac/InternalQualityAssuranceCell";
import ManagedCommittee from "@/src/components/sections/committees/ManagedCommittee";
import { getPublishedCommittee } from "@/src/lib/queries/committees";
import { getPageMetadata } from "@/src/lib/queries/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/iqac", {
    title: "Internal Quality Assurance Cell (IQAC) | S. Thangapazham College of Engineering & Technology",
    description:
      "IQAC quality mandates, objectives, and committee representation at STCET.",
  });
}

export default async function IQACPage() {
  const content = await getPublishedCommittee("iqac");
  return <><InternalQualityAssuranceCell />{content ? <ManagedCommittee {...content} /> : null}</>;
}
