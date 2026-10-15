import SCSTCell from "@/src/components/sections/sc-st-cell/SCSTCell";
import ManagedCommittee from "@/src/components/sections/committees/ManagedCommittee";
import { getPublishedCommittee } from "@/src/lib/queries/committees";

export default async function SCSTCellPage() {
  const content = await getPublishedCommittee("sc-st-cell");
  return <><SCSTCell />{content ? <ManagedCommittee {...content} /> : null}</>;
}
