import FacultyManager from "@/src/components/admin/faculty/FacultyManager";
import { isAdministrator, requireAdmin } from "@/src/lib/admin/authorization";
import {
  getAdminFaculty,
  getAdminFacultyFacets,
} from "@/src/lib/queries/admin-faculty";

export const metadata = { title: "Faculty | STCET Admin" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function scalar(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminFacultyPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = scalar(params.q) ?? "";
  const designation = scalar(params.designation) ?? "";
  const statusParam = scalar(params.status);
  const status =
    statusParam === "published" || statusParam === "draft"
      ? statusParam
      : "all";
  const sortParam = scalar(params.sort);
  const sort =
    sortParam === "name" ||
    sortParam === "designation" ||
    sortParam === "order"
      ? sortParam
      : "updated";
  const requestedPage = Number(scalar(params.page));

  const [admin, faculty, facets] = await Promise.all([
    requireAdmin(),
    getAdminFaculty({ query, designation, status, sort, page: requestedPage }),
    getAdminFacultyFacets(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <FacultyManager
        canPublish={isAdministrator(admin)}
        designations={facets.designations}
        groups={facets.groups}
        members={faculty.members}
        page={faculty.page}
        pageCount={faculty.pageCount}
        pageSize={faculty.pageSize}
        query={query}
        designation={designation}
        status={status}
        sort={sort}
        total={faculty.total}
      />
    </div>
  );
}
