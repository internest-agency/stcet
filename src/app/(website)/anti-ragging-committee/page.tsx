import type { Metadata } from "next";
import AntiRagging from "@/src/components/sections/anti-ragging-committee/AntiRagging";
import { getPublishedCommittee } from "@/src/lib/queries/committees";
import { getPageMetadata } from "@/src/lib/queries/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/anti-ragging-committee", {
    title: "Anti-Ragging Committee | S. Thangapazham College of Engineering & Technology",
    description:
      "Anti-Ragging Committee policy, guidelines, helpline, and committee members at STCET.",
  });
}

export default async function AntiRaggingCommittee() {
  const content = await getPublishedCommittee("anti-ragging-committee");
  return <AntiRagging members={content?.members ?? []} />;
}
