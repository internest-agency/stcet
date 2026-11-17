import type { Metadata } from "next";
import GrievanceRedressal from "@/src/components/sections/grievance-redressal-committee/GrievanceRedressal";
import { getPublishedCommittee } from "@/src/lib/queries/committees";
import { getPageMetadata } from "@/src/lib/queries/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/grievance-redressal-committee", {
    title: "Grievance Redressal Committee | S. Thangapazham College of Engineering & Technology",
    description:
      "Grievance Redressal Committee structure, procedures, and committee members at STCET.",
  });
}

export default async function GrievanceRedressalCommitteePage() {
  const content = await getPublishedCommittee("grievance-redressal-committee");
  return <GrievanceRedressal members={content?.members ?? []} />;
}
