import FacultyGroupManager from "@/src/components/admin/faculty/FacultyGroupManager";
import { isAdministrator, requireAdmin } from "@/src/lib/admin/authorization";
import { getAdminFacultyGroups } from "@/src/lib/queries/faculty-groups";

export const metadata = { title: "Faculty Groups | STCET Admin" };

export default async function AdminFacultyGroupsPage() {
  const admin = await requireAdmin();
  const groups = await getAdminFacultyGroups();

  return (
    <div className="mx-auto w-full max-w-4xl">
      <FacultyGroupManager canDelete={isAdministrator(admin)} groups={groups} />
    </div>
  );
}
