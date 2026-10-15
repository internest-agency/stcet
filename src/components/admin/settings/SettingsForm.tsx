"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import ImageUploadField from "@/src/components/admin/ImageUploadField";
import { saveSettings } from "@/src/app/admin/(protected)/settings/actions";
import { useRef, useState } from "react";

type FooterLink = { label: string; url: string };

type Settings = {
  collegeName: string;
  logoPath: string | null;
  faviconPath: string | null;
  contactEmail: string | null;
  phoneNumber: string | null;
  alternativePhone: string | null;
  address: string | null;
  socialLinks: unknown;
  footerLinks: Record<string, FooterLink[]> | null;
  footerText: string | null;
  defaultSeoTitle: string | null;
  defaultMetaDescription: string | null;
};

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
          Social links JSON
          <textarea
            className={input}
            defaultValue={
              settings?.socialLinks
                ? JSON.stringify(settings.socialLinks, null, 2)
                : ""
            }
            name="socialLinks"
            placeholder='{"linkedin":"https://"}'
            rows={4}
          />
        </label>
      </section>

      <SaveButton />
    </form>
  );
}
