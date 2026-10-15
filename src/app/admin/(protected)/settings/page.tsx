import SettingsForm from "@/src/components/admin/settings/SettingsForm";
import { requireAdministrator } from "@/src/lib/admin/authorization";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export const metadata = { title: "Settings | STCET Admin" };

function scalar(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseFooterLinks(
  raw: any,
): Record<string, { label: string; url: string }[]> | null {
  if (!raw) return null;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return {
        importantLinks: (parsed.importantLinks || []).map((l: any) => ({
          label: l.label,
          url: l.url,
        })),
        quickLinks: (parsed.quickLinks || []).map((l: any) => ({
          label: l.label,
          url: l.url,
        })),
      };
    } catch {
      return null;
    }
  }
  if (typeof raw === "object" && raw !== null) {
    return {
      importantLinks: (raw.importantLinks || []).map((l: any) => ({
        label: l.label,
        url: l.url,
      })),
      quickLinks: (raw.quickLinks || []).map((l: any) => ({
        label: l.label,
        url: l.url,
      })),
    };
  }
  return null;
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdministrator();

  const [rawSettings, params] = await Promise.all([
    isDatabaseConfigured() ? getPrismaClient().siteSettings.findFirst() : null,
    searchParams,
  ]);

  const saved = scalar(params.saved);
  const error = scalar(params.error);

  const settings = rawSettings
    ? { ...rawSettings, footerLinks: parseFooterLinks(rawSettings.footerLinks) }
    : null;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-primary-700">Website</p>
        <h2 className="mt-1 text-2xl font-bold">General Settings</h2>
        <p className="mt-2 text-sm text-gray-600">
          Only website content and presentation defaults are editable here;
          credentials remain in environment variables.
        </p>
      </section>

      {saved ? (
        <p
          aria-live="polite"
          className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-900"
        >
          Settings saved successfully.
        </p>
      ) : null}

      {error ? (
        <p
          aria-live="polite"
          className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          {error === "social"
            ? "Settings could not be saved. The social links field must contain valid JSON."
            : error === "save"
              ? "Settings could not be saved due to a database error. Please try again."
              : "Settings could not be saved. Use valid values and a valid social-links JSON object."}
        </p>
      ) : null}

      <SettingsForm settings={settings} />
    </div>
  );
}