import Link from "next/link";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import GalleryManager from "@/src/components/admin/gallery/GalleryManager";
import { isAdministrator, requireAdmin } from "@/src/lib/admin/authorization";
import { getAdminGalleryData } from "@/src/lib/queries/admin-gallery";

export const metadata = { title: "Gallery | STCET Admin" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function scalar(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const galleryErrors: Record<string, string> = {
  save: "The gallery change could not be saved. Check the database and try again.",
  "category-invalid": "Enter a valid category name, slug, and display order.",
  "category-duplicate": "That category name or slug is already in use.",
  "category-missing": "That category no longer exists.",
  "category-in-use": "Move or delete the category's images before deleting it.",
  "category-inactive": "Choose an active category for this image.",
  "image-invalid":
    "Review the title, alt text, image, category, and display order.",
  "image-missing": "That gallery image no longer exists.",
  "image-unregistered": "Upload a valid image before saving the gallery item.",
  "image-duplicate": "That uploaded image is already in the gallery.",
  forbidden: "Only administrators can change published gallery content.",
};

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = scalar(params.q) ?? "";
  const categoryId = Number(scalar(params.categoryId));
  const requestedPage = Number(scalar(params.page));
  const [admin, gallery] = await Promise.all([
    requireAdmin(),
    getAdminGalleryData({ query, categoryId, page: requestedPage }),
  ]);
  const error = scalar(params.error);

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-700">Content</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950">Gallery</h2>
          <p className="mt-2 text-sm text-gray-600">
            Organize campus images, accessible descriptions, and public
            visibility.
          </p>
        </div>
        <Link
          className="inline-flex min-h-10 items-center gap-2 self-start rounded-md border border-gray-300 bg-white px-3 text-sm font-bold text-gray-700 hover:bg-gray-50 sm:self-auto"
          href="/gallery"
          target="_blank"
        >
          View public gallery
        </Link>
      </section>

      {error ? (
        <p
          aria-live="polite"
          className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          {galleryErrors[error] ??
            "The gallery operation could not be completed."}
        </p>
      ) : null}
      {scalar(params.saved) ? (
        <p className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-900">
          Gallery changes saved.
        </p>
      ) : null}
      {scalar(params.deleted) ? (
        <p className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-900">
          Gallery item removed.
        </p>
      ) : null}

      <form
        className="grid gap-3 rounded-md border border-gray-200 bg-white p-4 sm:grid-cols-[minmax(220px,1fr)_220px_auto]"
        method="get"
      >
        <label className="relative block">
          <span className="sr-only">Search gallery</span>
          <Search
            aria-hidden
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
          />
          <input
            className="min-h-10 w-full rounded-md border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            defaultValue={query}
            name="q"
            placeholder="Search title, alt text, or path"
          />
        </label>
        <label>
          <span className="sr-only">Gallery category</span>
          <select
            className="min-h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            defaultValue={Number.isSafeInteger(categoryId) ? categoryId : "all"}
            name="categoryId"
          >
            <option value="all">All categories</option>
            {gallery.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <button className="min-h-10 rounded-md border border-gray-300 px-4 text-sm font-bold text-gray-700 hover:bg-gray-50">
          Filter
        </button>
      </form>

      <GalleryManager
        canPublish={isAdministrator(admin)}
        categories={gallery.categories}
        images={gallery.images}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-gray-500">
          {gallery.total} {gallery.total === 1 ? "image" : "images"} · Page{" "}
          {gallery.page} of {gallery.pageCount}
        </p>
        <div className="flex gap-2">
          {gallery.page > 1 ? (
            <Link
              aria-label="Previous gallery page"
              className="grid size-9 place-items-center rounded-md border border-gray-300 text-gray-700 hover:bg-white"
              href={{
                pathname: "/admin/gallery",
                query: {
                  q: query,
                  categoryId: String(categoryId || "all"),
                  page: String(gallery.page - 1),
                },
              }}
            >
              <ArrowLeft aria-hidden className="size-4" />
            </Link>
          ) : null}
          {gallery.page < gallery.pageCount ? (
            <Link
              aria-label="Next gallery page"
              className="grid size-9 place-items-center rounded-md border border-gray-300 text-gray-700 hover:bg-white"
              href={{
                pathname: "/admin/gallery",
                query: {
                  q: query,
                  categoryId: String(categoryId || "all"),
                  page: String(gallery.page + 1),
                },
              }}
            >
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
