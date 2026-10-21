import AboutContentManager from "@/src/components/admin/about/AboutContentManager";
import { isAdministrator, requireAdmin } from "@/src/lib/admin/authorization";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export const metadata = { title: "About | STCET Admin" };

export default async function AboutContentAdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [admin, params] = await Promise.all([requireAdmin(), searchParams]);

  const data = isDatabaseConfigured()
    ? await (async () => {
        const prisma = getPrismaClient();
        const [
          founders,
          chairman,
          visionMission,
          missionItems,
          trust,
          pillars,
        ] = await Promise.all([
          prisma.aboutFounder.findMany({
            orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
          }),
          prisma.aboutChairmanMessage.findFirst({ orderBy: { id: "asc" } }),
          prisma.aboutVisionMission.findFirst({ orderBy: { id: "asc" } }),
          prisma.aboutMissionItem.findMany({
            orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
          }),
          prisma.aboutTrust.findFirst({ orderBy: { id: "asc" } }),
          prisma.aboutTrustPillar.findMany({
            orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
          }),
        ]);
        return {
          founders,
          chairman,
          visionMission,
          missionItems,
          trust,
          pillars,
        };
      })()
    : {
        founders: [],
        chairman: null,
        visionMission: null,
        missionItems: [],
        trust: null,
        pillars: [],
      };

  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section>
        <p className="text-sm font-semibold text-primary-700">Content</p>
        <h2 className="mt-1 text-2xl font-bold">About Page Content</h2>
        <p className="mt-2 text-sm text-gray-600">
          Edit the Our Founders, Chairman&apos;s Message, Vision &amp; Mission
          and Our Trust sections exactly as they appear on the public About
          page. Changes are published to the site as soon as you save.
        </p>
      </section>

      {error ? (
        <p className="rounded border border-amber-200 bg-amber-50 p-3 text-sm">
          The About content could not be saved. Check the required fields and
          image selection, then try again.
        </p>
      ) : null}

      <AboutContentManager canPublish={isAdministrator(admin)} data={data} />
    </div>
  );
}
