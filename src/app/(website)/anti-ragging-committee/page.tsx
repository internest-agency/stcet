import AntiRagging from "@/src/components/sections/anti-ragging-committee/AntiRagging";
import { getPublishedCommittee } from "@/src/lib/queries/committees";

export default async function AntiRaggingCommittee() {
  const content = await getPublishedCommittee("anti-ragging-committee");
  return <AntiRagging members={content?.members ?? []} />;
}
