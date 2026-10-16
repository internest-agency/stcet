import SeoManager, {
  type SeoRecord,
} from "@/src/components/admin/seo/SeoManager";
import { requireAdministrator } from "@/src/lib/admin/authorization";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export const metadata = { title: "SEO | STCET Admin" };

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SeoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdministrator();
  const params = await searchParams;

  let records: SeoRecord[] = [];
  let loadError = false;

  if (isDatabaseConfigured()) {
    try {
      records = await getPrismaClient().pageSeo.findMany({
        orderBy: { pagePath: "asc" },
        select: {
          id: true,
          pagePath: true,
          pageTitle: true,
          seoTitle: true,
          metaDescription: true,
          canonicalUrl: true,
          ogImage: true,
          noIndex: true,
        },
      });
    } catch (error) {
      console.error("Failed to load SEO records:", error);
      loadError = true;
    }
  }

  const errorParam = first(params.error);
  const saved = first(params.saved) === "1";

  return (
    <SeoManager
      error={
        errorParam
          ? "The SEO record could not be saved. Review its path and URLs."
          : null
      }
      loadError={loadError}
      notice={saved ? "SEO metadata saved." : null}
      records={records}
    />
  );
}
