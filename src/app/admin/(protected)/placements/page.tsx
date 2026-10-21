import Link from "next/link";
import { ExternalLink } from "lucide-react";
import PlacementsManager from "@/src/components/admin/placements/PlacementsManager";
import PlacementLeadershipManager from "@/src/components/admin/placements/PlacementLeadershipManager";
import { isAdministrator, requireAdmin } from "@/src/lib/admin/authorization";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export const metadata = { title: "Placements | STCET Admin" };

export default async function PlacementsPage() {
  const admin = await requireAdmin();
  const data = isDatabaseConfigured()
    ? await Promise.all([
        getPrismaClient().placementCompany.findMany({
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        }),
        getPrismaClient().trainingProgramme.findMany({
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        }),
        getPrismaClient().industryInteraction.findMany({
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        }),
        getPrismaClient().placementLeadership.findFirst({
          orderBy: { id: "asc" },
          include: {
            items: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
          },
        }),
      ])
    : ([[], [], [], null] as [never[], never[], never[], null]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-gray-500"
          >
            <span>STCET</span>
            <span aria-hidden className="text-gray-300">
              /
            </span>
            <span>Admin</span>
            <span aria-hidden className="text-gray-300">
              /
            </span>
            <span className="text-gray-700">Placements</span>
          </nav>
          <h2 className="mt-1.5 text-xl font-bold text-gray-900">
            Placements Management
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage placement partners, training programmes, and industry
            interactions.
          </p>
        </div>
        <Link
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
          href="/placements"
          target="_blank"
        >
          <ExternalLink aria-hidden className="size-4" />
          View public placements page
        </Link>
      </header>

      <PlacementsManager
        canPublish={isAdministrator(admin)}
        companies={data[0]}
        interactions={data[2]}
        programmes={data[1]}
      />

      <PlacementLeadershipManager
        canPublish={isAdministrator(admin)}
        items={data[3]?.items ?? []}
        leadership={data[3]}
      />
    </div>
  );
}
