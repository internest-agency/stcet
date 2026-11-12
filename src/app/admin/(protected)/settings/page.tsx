import SettingsForm from "@/src/components/admin/settings/SettingsForm";
import { requireAdministrator } from "@/src/lib/admin/authorization";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";


export const metadata = { title: "Settings | STCET Admin" };

function scalar(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

type FooterLink = { label: string; url: string };
type FooterLinksRaw = { importantLinks?: FooterLink[]; quickLinks?: FooterLink[] } | null;

function parseFooterLinks(
  raw: unknown,
): Record<string, FooterLink[]> | null {
  if (!raw) return null;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as FooterLinksRaw;
      return {
        importantLinks: (parsed?.importantLinks || []).map((l) => ({
          label: l.label,
          url: l.url,
        })),
        quickLinks: (parsed?.quickLinks || []).map((l) => ({
          label: l.label,
          url: l.url,
        })),
      };
    } catch {
      return null;
    }
  }
  if (typeof raw === "object" && raw !== null) {
    const obj = raw as FooterLinksRaw;
    return {
      importantLinks: (obj?.importantLinks || []).map((l) => ({
        label: l.label,
        url: l.url,
      })),
      quickLinks: (obj?.quickLinks || []).map((l) => ({
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
  const testResult = scalar(params.test_result);

  const rawSocial = (() => {
    const v = rawSettings?.socialLinks;
    if (!v) return {} as Record<string, string | null>;
    if (typeof v === "string") {
      try {
        const parsed = JSON.parse(v) as Record<string, unknown>;
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch {
        return {} as Record<string, string | null>;
      }
    }
    if (typeof v === "object" && !Array.isArray(v)) {
      return v as Record<string, unknown>;
    }
    return {} as Record<string, string | null>;
  })();

  const settings = rawSettings
    ? {
        ...rawSettings,
        footerLinks: parseFooterLinks(rawSettings.footerLinks),
        socialLinks: {
          instagram: typeof rawSocial.instagram === "string" ? rawSocial.instagram : null,
          youtube: typeof rawSocial.youtube === "string" ? rawSocial.youtube : null,
          facebook: typeof rawSocial.facebook === "string" ? rawSocial.facebook : null,
          linkedin: typeof rawSocial.linkedin === "string" ? rawSocial.linkedin : null,
          x: typeof rawSocial.x === "string" ? rawSocial.x : null,
          whatsapp: typeof rawSocial.whatsapp === "string" ? rawSocial.whatsapp : null,
        },
        googleMapsEmbedUrl: rawSettings.googleMapsEmbedUrl ?? null,
        // ZeptoMail
        zeptoEnabled: rawSettings.zeptoEnabled ?? false,
        zeptoApiEndpoint: rawSettings.zeptoApiEndpoint ?? null,
        zeptoSenderEmail: rawSettings.zeptoSenderEmail ?? null,
        zeptoSenderName: rawSettings.zeptoSenderName ?? null,
        zeptoAdminEmail: rawSettings.zeptoAdminEmail ?? null,
        zeptoNotifyContact: rawSettings.zeptoNotifyContact ?? false,
        zeptoNotifyEnquiry: rawSettings.zeptoNotifyEnquiry ?? false,
        zeptoLastTestAt: rawSettings.zeptoLastTestAt ?? null,
        zeptoLastTestResult: rawSettings.zeptoLastTestResult ?? null,
      }
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

      {testResult ? (
        <p
          aria-live="polite"
          className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-900"
        >
          <strong>Test Email Result:</strong> {testResult}
        </p>
      ) : null}

      {error ? (
        <p
          aria-live="polite"
          className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          <strong>Settings could not be saved:</strong> {error}
        </p>
      ) : null}

      <SettingsForm settings={settings} />
    </div>
  );
}