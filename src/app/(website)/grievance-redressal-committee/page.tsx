import GrievanceRedressal from "@/src/components/sections/grievance-redressal-committee/GrievanceRedressal";
import { getPublishedCommittee } from "@/src/lib/queries/committees";

export default async function GrievanceRedressalCommitteePage() {
  const content = await getPublishedCommittee("grievance-redressal-committee");
  return <GrievanceRedressal members={content?.members ?? []} />;
}
