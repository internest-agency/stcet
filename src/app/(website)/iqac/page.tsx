import InternalQualityAssuranceCell from "@/src/components/sections/iqac/InternalQualityAssuranceCell";
import ManagedCommittee from "@/src/components/sections/committees/ManagedCommittee";
import { getPublishedCommittee } from "@/src/lib/queries/committees";

export default async function IQACPage() {
  const content = await getPublishedCommittee("iqac");
  return <><InternalQualityAssuranceCell />{content ? <ManagedCommittee {...content} /> : null}</>;
}
