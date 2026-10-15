import InternalComplaintsCommittee from "@/src/components/sections/internal-complaints-committee/InternalComplaintsCommittee";
import { getPublishedCommittee } from "@/src/lib/queries/committees";

export default async function InternalComplaintsCommitteePage() {
  const content = await getPublishedCommittee("internal-complaints-committee");
  return <InternalComplaintsCommittee members={content?.members ?? []} />;
}
