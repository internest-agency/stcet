"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Save, Eye, EyeOff, Send, Mail, Shield } from "lucide-react";
import ImageUploadField from "@/src/components/admin/ImageUploadField";
import { saveSettings } from "@/src/app/admin/(protected)/settings/actions";
import { useRef, useState } from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaXTwitter, FaWhatsapp } from "react-icons/fa6";

type FooterLink = { label: string; url: string };

type Settings = {
  collegeName: string;
  logoPath: string | null;
  faviconPath: string | null;
  contactEmail: string | null;
  phoneNumber: string | null;
  alternativePhone: string | null;
  address: string | null;
  socialLinks: Record<string, string | null> | null;
  footerLinks: Record<string, FooterLink[]> | null;
  footerText: string | null;
  defaultSeoTitle: string | null;
  defaultMetaDescription: string | null;
  googleMapsEmbedUrl: string | null;
  // ZeptoMail
  zeptoEnabled: boolean;
  zeptoApiEndpoint: string | null;
  zeptoSenderEmail: string | null;
  zeptoSenderName: string | null;
  zeptoAdminEmail: string | null;
  zeptoNotifyContact: boolean;
  zeptoNotifyEnquiry: boolean;
  zeptoLastTestAt: Date | null;
  zeptoLastTestResult: string | null;
};

const socialPlatforms = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/your-profile", Icon: FaInstagram },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@your-channel", Icon: FaYoutube },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/your-page", Icon: FaFacebook },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/your-company", Icon: FaLinkedin },
  { key: "x", label: "X (Twitter)", placeholder: "https://x.com/your-profile", Icon: FaXTwitter },
  { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/919876543210", Icon: FaWhatsapp },
] as const;

const input =
  "mt-1 min-h-10 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100";

/** Separate component so useFormStatus can read the parent form's pending state. */
function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      aria-disabled={pending}
      className="inline-flex min-h-10 items-center gap-2 rounded bg-primary-700 px-4 text-sm font-bold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <Loader2 aria-hidden className="size-4 animate-spin" />
      ) : (
        <Save aria-hidden className="size-4" />
      )}
      {pending ? "Saving…" : "Save settings"}
    </button>
  );
}

/** Convert a textarea's text (one "label | url" per line) into an array of FooterLink objects. */
function parseTextareaLinks(raw: string): FooterLink[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const idx = line.indexOf("|");
      if (idx === -1) return [];
      const label = line.slice(0, idx).trim();
      const url = line.slice(idx + 1).trim();
      if (!label || !url) return [];
      return [{ label, url }];
    });
}

export default function SettingsForm({
  settings,
}: {
  settings: Settings | null;
}) {
  const [logoPath, setLogoPath] = useState(settings?.logoPath ?? "");
  const [faviconPath, setFaviconPath] = useState(settings?.faviconPath ?? "");
  const [showToken, setShowToken] = useState(false);

  const importantLinksDefault = (
    settings?.footerLinks?.importantLinks ?? []
  )
    .map((l) => `${l.label} | ${l.url}`)
    .join("\n");

  const quickLinksDefault = (settings?.footerLinks?.quickLinks ?? [])
    .map((l) => `${l.label} | ${l.url}`)
    .join("\n");

  // Refs to read the current textarea values at submit time, so we can
  // build the JSON that the server action expects.
  const importantRef = useRef<HTMLTextAreaElement>(null);
  const quickRef = useRef<HTMLTextAreaElement>(null);
  const footerLinksRef = useRef<HTMLInputElement>(null);

  function buildFooterLinksJson() {
    const importantLinks = parseTextareaLinks(
      importantRef.current?.value ?? "",
    );
    const quickLinks = parseTextareaLinks(quickRef.current?.value ?? "");
    if (footerLinksRef.current) {
      footerLinksRef.current.value = JSON.stringify({
        importantLinks,
        quickLinks,
      });
    }
  }

  return (
    <form
      action={saveSettings}
      className="space-y-5"
      onSubmit={buildFooterLinksJson}
    >
      {/* Hidden fields populated by JS/refs */}
      <input name="logoPath" type="hidden" value={logoPath} />
      <input name="faviconPath" type="hidden" value={faviconPath} />
      {/* footerLinks is serialised into this hidden input just before submit */}
      <input
        defaultValue={JSON.stringify(settings?.footerLinks ?? { importantLinks: [], quickLinks: [] })}
        name="footerLinks"
        ref={footerLinksRef}
        type="hidden"
      />

      {/* College details */}
      <section className="grid gap-3 rounded border border-gray-200 bg-white p-5 md:grid-cols-2">
        <label>
          College name
          <input
            className={input}
            defaultValue={settings?.collegeName ?? ""}
            name="collegeName"
            required
          />
        </label>
        <label>
          Contact email
          <input
            className={input}
            defaultValue={settings?.contactEmail ?? ""}
            name="contactEmail"
            type="email"
          />
        </label>
        <label>
          Phone number
          <input
            className={input}
            defaultValue={settings?.phoneNumber ?? ""}
            name="phoneNumber"
          />
        </label>
        <label>
          Alternative phone
          <input
            className={input}
            defaultValue={settings?.alternativePhone ?? ""}
            name="alternativePhone"
          />
        </label>
        <label className="md:col-span-2">
          Address
          <textarea
            className={input}
            defaultValue={settings?.address ?? ""}
            name="address"
            rows={3}
          />
        </label>
      </section>

      {/* Footer menu */}
      <section className="rounded border border-gray-200 bg-white p-5">
        <p className="mb-4 text-sm font-medium text-gray-800">
          Footer Menu Management
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="importantLinksTextarea"
            >
              Important Links
            </label>
            <textarea
              className={input}
              defaultValue={importantLinksDefault}
              id="importantLinksTextarea"
              placeholder={"IQAC | /iqac\nAnti Ragging Committee | /anti-ragging-committee"}
              ref={importantRef}
              rows={5}
            />
            <p className="mt-1 text-xs text-gray-500">
              One link per line — format: <code>Label | /path-or-url</code>
            </p>
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="quickLinksTextarea"
            >
              Quick Links
            </label>
            <textarea
              className={input}
              defaultValue={quickLinksDefault}
              id="quickLinksTextarea"
              placeholder={"Home | /\nAbout Us | /about\nContact | /enquire-now"}
              ref={quickRef}
              rows={5}
            />
            <p className="mt-1 text-xs text-gray-500">
              One link per line — format: <code>Label | /path-or-url</code>
            </p>
          </div>
        </div>
      </section>

      {/* SEO & branding */}
      <section className="grid gap-3 rounded border border-gray-200 bg-white p-5 md:grid-cols-2">
        <ImageUploadField
          category="pages"
          label="College logo"
          onChange={setLogoPath}
          value={logoPath}
        />
        <ImageUploadField
          category="pages"
          label="Favicon image"
          onChange={setFaviconPath}
          value={faviconPath}
        />
        <label>
          Default SEO title
          <input
            className={input}
            defaultValue={settings?.defaultSeoTitle ?? ""}
            name="defaultSeoTitle"
          />
        </label>
        <label>
          Default meta description
          <textarea
            className={input}
            defaultValue={settings?.defaultMetaDescription ?? ""}
            name="defaultMetaDescription"
            rows={2}
          />
        </label>
        <label className="md:col-span-2">
          Social links
          <p className="mt-1 text-xs text-gray-500">
            Enter a valid HTTPS URL for each platform. Use <code>#</code> or leave
            blank to hide the icon on the public site.
          </p>
        </label>
        {socialPlatforms.map(({ key, label, placeholder, Icon }) => (
          <label key={key} className="flex items-center gap-3">
            <Icon aria-hidden className="size-5 text-gray-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-medium text-gray-700">{label}</span>
              <input
                className={input}
                defaultValue={settings?.socialLinks?.[key] ?? ""}
                name={`social${key.charAt(0).toUpperCase() + key.slice(1)}`}
                placeholder={placeholder}
              />
            </div>
          </label>
        ))}
      </section>

      {/* Campus Location / Google Maps */}
      <section className="rounded border border-gray-200 bg-white p-5">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-800">
            Campus Location / Google Maps
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Paste the Google Maps iframe embed code from Google Maps. The saved map
            will appear in the Visit Our Campus section.
          </p>
        </div>
        <label className="block">
          <span className="text-xs font-medium text-gray-700">Google Maps Embed Code</span>
          <textarea
            className={`${input} min-h-[120px] font-mono text-xs`}
            defaultValue={settings?.googleMapsEmbedUrl ?? ""}
            name="googleMapsEmbed"
            placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
            rows={5}
          />
        </label>

        {/* Preview */}
        {settings?.googleMapsEmbedUrl && (
          <div className="mt-4 rounded border border-gray-200 bg-gray-50 p-4">
            <p className="mb-2 text-xs font-medium text-gray-700">Map Preview</p>
            <div className="relative aspect-[16/9] w-full max-w-2xl overflow-hidden">
              <iframe
                title="Google Maps embed preview"
                src={settings.googleMapsEmbedUrl}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              This is how the map will appear on the public website.
            </p>
          </div>
        )}
      </section>

      {/* Email Notifications — ZeptoMail */}
      <section className="rounded border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">Email Notifications — ZeptoMail</p>
            <p className="mt-1 text-xs text-gray-500">
              Configure ZeptoMail to receive email notifications for public form submissions.
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="zeptoEnabled"
              defaultChecked={settings?.zeptoEnabled ?? false}
              className="h-4 w-4 rounded border-gray-300 text-primary-700 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Enable email notifications</span>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <div className="flex items-center gap-2 mb-1">
              <Mail aria-hidden className="size-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-700">ZeptoMail API Endpoint</span>
            </div>
            <input
              className={input}
              defaultValue={settings?.zeptoApiEndpoint ?? "https://api.zeptomail.com/v1.1/email"}
              name="zeptoApiEndpoint"
              placeholder="https://api.zeptomail.com/v1.1/email"
              disabled={!settings?.zeptoEnabled}
            />
            <p className="mt-1 text-xs text-gray-500">
              Official ZeptoMail send endpoint. Change only if required.
            </p>
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-1">
              <Shield aria-hidden className="size-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-700">Send Mail Token</span>
            </div>
            <div className="relative">
              <input
                className={`${input} pr-10`}
                type={showToken ? "text" : "password"}
                name="zeptoToken"
                placeholder="Enter your ZeptoMail Send Mail Token"
                disabled={!settings?.zeptoEnabled}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowToken(!showToken)}
                aria-label={showToken ? "Hide token" : "Show token"}
              >
                {showToken ? <EyeOff aria-hidden className="size-5" /> : <Eye aria-hidden className="size-5" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Your ZeptoMail Send Mail Token. Leave blank to keep the existing token.
              The token is encrypted at rest and never exposed in responses.
            </p>
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-1">
              <Mail aria-hidden className="size-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-700">Sender Email Address</span>
            </div>
            <input
              className={input}
              defaultValue={settings?.zeptoSenderEmail ?? ""}
              name="zeptoSenderEmail"
              type="email"
              placeholder="noreply@yourdomain.com"
              disabled={!settings?.zeptoEnabled}
            />
            <p className="mt-1 text-xs text-gray-500">
              The verified sender address configured in your ZeptoMail account.
            </p>
          </label>

          <label className="block">
            <div className="flex items-center gap-2 mb-1">
              <Mail aria-hidden className="size-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-700">Sender Name</span>
            </div>
            <input
              className={input}
              defaultValue={settings?.zeptoSenderName ?? "STCET Website"}
              name="zeptoSenderName"
              placeholder="STCET Website"
              disabled={!settings?.zeptoEnabled}
            />
          </label>

          <label className="md:col-span-2 block">
            <div className="flex items-center gap-2 mb-1">
              <Mail aria-hidden className="size-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-700">Admin Notification Email</span>
            </div>
            <input
              className={input}
              defaultValue={settings?.zeptoAdminEmail ?? ""}
              name="zeptoAdminEmail"
              type="email"
              placeholder="admin@yourdomain.com"
              disabled={!settings?.zeptoEnabled}
            />
            <p className="mt-1 text-xs text-gray-500">
              Email address that will receive form submission notifications.
            </p>
          </label>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="zeptoNotifyContact"
              defaultChecked={settings?.zeptoNotifyContact ?? false}
              disabled={!settings?.zeptoEnabled}
              className="h-4 w-4 rounded border-gray-300 text-primary-700 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Contact form submissions</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="zeptoNotifyEnquiry"
              defaultChecked={settings?.zeptoNotifyEnquiry ?? false}
              disabled={!settings?.zeptoEnabled}
              className="h-4 w-4 rounded border-gray-300 text-primary-700 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Admissions enquiry submissions</span>
          </label>
        </div>

        {/* Test Email Section */}
        {settings?.zeptoEnabled && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Send aria-hidden className="size-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Send Test Email</p>
                  <p className="text-xs text-gray-500">
                    Verify your configuration by sending a test email to the admin address.
                  </p>
                </div>
              </div>
              <button
                type="submit"
                name="action"
                value="testEmail"
                className="inline-flex items-center gap-2 rounded bg-accent-400 px-4 py-2 text-sm font-bold text-white hover:bg-accent-500"
              >
                <Send aria-hidden className="size-4" />
                Send Test Email
              </button>
            </div>

            {settings?.zeptoLastTestAt || settings?.zeptoLastTestResult ? (
              <div className="mt-4 text-xs text-gray-500">
                <p>
                  Last test:{" "}
                  {settings.zeptoLastTestAt
                    ? new Date(settings.zeptoLastTestAt).toLocaleString()
                    : "Never"}
                  {settings.zeptoLastTestResult
                    ? ` — Result: ${settings.zeptoLastTestResult}`
                    : ""}
                </p>
              </div>
            ) : null}
          </div>
        )}

        <p className="mt-2 text-xs text-gray-500">
          The API token is encrypted using AES-256-GCM and never exposed in responses or client bundles.
          Requires <code>ZEPTOMAIL_ENCRYPTION_KEY</code> environment variable for encryption.
        </p>
      </section>

      <SaveButton />
    </form>
  );
}
