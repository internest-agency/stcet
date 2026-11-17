import type { Metadata } from "next";
import InternalComplaintsCommittee from "@/src/components/sections/internal-complaints-committee/InternalComplaintsCommittee";
import { getPublishedCommittee } from "@/src/lib/queries/committees";
import { getPageMetadata } from "@/src/lib/queries/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/internal-complaints-committee", {
    title: "Internal Complaints Committee | S. Thangapazham College of Engineering & Technology",
    description:
      "Internal Complaints Committee (ICC) policy and members at S. Thangapazham College of Engineering & Technology.",
  });
}

export default async function InternalComplaintsCommitteePage() {
  const content = await getPublishedCommittee("internal-complaints-committee");
  return <InternalComplaintsCommittee members={content?.members ?? []} />;
}
