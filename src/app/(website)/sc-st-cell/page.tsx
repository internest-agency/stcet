import type { Metadata } from "next";
import SCSTCell from "@/src/components/sections/sc-st-cell/SCSTCell";
import ManagedCommittee from "@/src/components/sections/committees/ManagedCommittee";
import { getPublishedCommittee } from "@/src/lib/queries/committees";
import { getPageMetadata } from "@/src/lib/queries/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/sc-st-cell", {
    title: "SC/ST Cell | S. Thangapazham College of Engineering & Technology",
    description:
      "SC/ST Cell empowerment, welfare policies, and committee members at STCET.",
  });
}

export default async function SCSTCellPage() {
  const content = await getPublishedCommittee("sc-st-cell");
  return <><SCSTCell />{content ? <ManagedCommittee {...content} /> : null}</>;
}
