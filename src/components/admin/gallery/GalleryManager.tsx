"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Plus, Save, Trash2 } from "lucide-react";
import ImageUploadField from "@/src/components/admin/ImageUploadField";
import {
  deleteGalleryCategory,
  deleteGalleryImage,
  saveGalleryCategory,
  saveGalleryImage,
} from "@/src/app/admin/(protected)/gallery/actions";

export type GalleryCategoryRow = {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  _count: { images: number };
};

export type GalleryImageRow = {
  id: number;
  title: string;
  altText: string;
  imagePath: string;
  isPublished: boolean;
  sortOrder: number;
  categoryId: number;
  category: { name: string };
};

const inputClass =
  "mt-1.5 min-h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100";

function CategoryDeleteForm({ category }: { category: GalleryCategoryRow }) {
  return (
    <form
      action={deleteGalleryCategory}
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Remove the ${category.name} category? This is available only when it has no images.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input name="categoryId" type="hidden" value={category.id} />
      <button
        aria-label={`Delete ${category.name} category`}
        className="grid size-9 place-items-center rounded-md text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
        disabled={category._count.images > 0}
        title={
          category._count.images > 0
            ? "Move or delete its images first"
            : "Delete category"
        }
        type="submit"
      >
        <Trash2 aria-hidden className="size-4" />
      </button>
    </form>
  );
}

function GalleryImageForm({
  categories,
  image,
  canPublish,
}: {
  categories: GalleryCategoryRow[];
  image?: GalleryImageRow;
  canPublish: boolean;
}) {
  const id = useId();
  const [imagePath, setImagePath] = useState(image?.imagePath ?? "");
  const activeCategories = categories.filter(
    (category) => category.isActive || category.id === image?.categoryId,
  );

  return (
    <form action={saveGalleryImage} className="space-y-4">
      {image ? <input name="imageId" type="hidden" value={image.id} /> : null}
      <input name="imagePath" type="hidden" value={imagePath} />
      <div className="grid gap-4 md:grid-cols-2">
        <label
          className="block text-sm font-semibold text-gray-700"
          htmlFor={`${id}-title`}
        >
          Title
          <input
            className={inputClass}
            defaultValue={image?.title ?? ""}
            id={`${id}-title`}
            maxLength={191}
            name="title"
            required
          />
        </label>
        <label
          className="block text-sm font-semibold text-gray-700"
          htmlFor={`${id}-alt`}
        >
          Alt text
          <input
            className={inputClass}
            defaultValue={image?.altText ?? ""}
            id={`${id}-alt`}
            maxLength={255}
            name="altText"
            required
          />
        </label>
        <label
          className="block text-sm font-semibold text-gray-700"
          htmlFor={`${id}-category`}
        >
          Category
          <select
            className={inputClass}
            defaultValue={image?.categoryId ?? activeCategories[0]?.id ?? ""}
            id={`${id}-category`}
            name="categoryId"
            required
          >
            {activeCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
                {!category.isActive ? " (inactive)" : ""}
              </option>
            ))}
          </select>
        </label>
        <label
          className="block text-sm font-semibold text-gray-700"
          htmlFor={`${id}-order`}
        >
          Display order
          <input
            className={inputClass}
            defaultValue={image?.sortOrder ?? 0}
            id={`${id}-order`}
            max={99999}
            min={0}
            name="sortOrder"
            required
            type="number"
          />
        </label>
      </div>
      <ImageUploadField
        category="gallery"
        label="Gallery image"
        onChange={setImagePath}
        value={imagePath}
      />
      {canPublish ? (
        <label className="flex min-h-10 items-center gap-3 text-sm font-semibold text-gray-700">
          <input
            className="size-4 accent-primary-700"
            defaultChecked={image?.isPublished ?? false}
            name="isPublished"
            type="checkbox"
          />
          Published on the public gallery
        </label>
      ) : (
        <input name="isPublished" type="hidden" value="off" />
      )}
      <button className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary-700 px-4 py-2 text-sm font-bold text-white hover:bg-primary-800">
        <Save aria-hidden className="size-4" />
        {image ? "Save image" : "Add image"}
      </button>
    </form>
  );
}

function GalleryImageDeleteForm({ image }: { image: GalleryImageRow }) {
  return (
    <form
      action={deleteGalleryImage}
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Delete "${image.title}" from the gallery? Its file is removed only if no other content uses it.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input name="imageId" type="hidden" value={image.id} />
      <button
        aria-label={`Delete ${image.title}`}
        className="grid size-9 place-items-center rounded-md text-red-700 hover:bg-red-50"
        title="Delete image"
        type="submit"
      >
        <Trash2 aria-hidden className="size-4" />
      </button>
    </form>
  );
}

export default function GalleryManager({
  categories,
  images,
  canPublish,
}: {
  categories: GalleryCategoryRow[];
  images: GalleryImageRow[];
  canPublish: boolean;
}) {
  const newCategoryId = useId();

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-md border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h3 className="font-bold text-gray-900">Gallery categories</h3>
          <p className="mt-1 text-sm text-gray-500">
            Categories with images can be deactivated but not deleted.
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {categories.map((category) => (
            <div
              className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:px-5"
              key={category.id}
            >
              <form
                action={saveGalleryCategory}
                className="grid gap-3 sm:grid-cols-[minmax(140px,1fr)_minmax(140px,1fr)_100px_auto]"
              >
                <input name="categoryId" type="hidden" value={category.id} />
                <label className="block text-xs font-semibold text-gray-600">
                  Name
                  <input
                    className={inputClass}
                    defaultValue={category.name}
                    maxLength={80}
                    name="name"
                    required
                  />
                </label>
                <label className="block text-xs font-semibold text-gray-600">
                  Slug
                  <input
                    className={inputClass}
                    defaultValue={category.slug}
                    maxLength={96}
                    name="slug"
                    required
                  />
                </label>
                <label className="block text-xs font-semibold text-gray-600">
                  Order
                  <input
                    className={inputClass}
                    defaultValue={category.sortOrder}
                    max={9999}
                    min={0}
                    name="sortOrder"
                    required
                    type="number"
                  />
                </label>
                <div className="flex items-end gap-3 pb-1">
                  <label className="flex min-h-10 items-center gap-2 text-xs font-semibold text-gray-700">
                    <input
                      className="size-4 accent-primary-700"
                      defaultChecked={category.isActive}
                      name="isActive"
                      type="checkbox"
                    />
                    Active
                  </label>
                  <button
                    aria-label={`Save ${category.name}`}
                    className="grid size-10 place-items-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    title="Save category"
                    type="submit"
                  >
                    <Save aria-hidden className="size-4" />
                  </button>
                </div>
              </form>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="text-xs text-gray-500">
                  {category._count.images} images
                </span>
                <CategoryDeleteForm category={category} />
              </div>
            </div>
          ))}
        </div>
        <form
          action={saveGalleryCategory}
          className="grid gap-3 border-t border-gray-200 bg-gray-50 p-4 sm:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_100px_auto] sm:px-5"
        >
          <label
            className="block text-xs font-semibold text-gray-600"
            htmlFor={`${newCategoryId}-name`}
          >
            New category
            <input
              className={inputClass}
              id={`${newCategoryId}-name`}
              maxLength={80}
              name="name"
              placeholder="Category name"
              required
            />
          </label>
          <label
            className="block text-xs font-semibold text-gray-600"
            htmlFor={`${newCategoryId}-slug`}
          >
            Slug
            <input
              className={inputClass}
              id={`${newCategoryId}-slug`}
              maxLength={96}
              name="slug"
              placeholder="category-slug"
              required
            />
          </label>
          <label
            className="block text-xs font-semibold text-gray-600"
            htmlFor={`${newCategoryId}-order`}
          >
            Order
            <input
              className={inputClass}
              defaultValue={categories.length}
              id={`${newCategoryId}-order`}
              min={0}
              name="sortOrder"
              type="number"
            />
          </label>
          <div className="flex items-end gap-3 pb-1">
            <label className="flex min-h-10 items-center gap-2 text-xs font-semibold text-gray-700">
              <input
                className="size-4 accent-primary-700"
                defaultChecked
                name="isActive"
                type="checkbox"
              />
              Active
            </label>
            <button className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary-700 px-3 text-sm font-bold text-white hover:bg-primary-800">
              <Plus aria-hidden className="size-4" /> Add
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-md border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <h3 className="font-bold text-gray-900">Add gallery image</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload, add accessible text, then publish when ready.
          </p>
        </div>
        <div className="p-4 sm:p-5">
          {categories.some((category) => category.isActive) ? (
            <GalleryImageForm canPublish={canPublish} categories={categories} />
          ) : (
            <p className="text-sm text-gray-600">
              Add an active category before adding gallery images.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="font-bold text-gray-900">Gallery images</h3>
          <p className="mt-1 text-sm text-gray-500">
            {images.length} {images.length === 1 ? "image" : "images"} on this
            page
          </p>
        </div>
        {images.length ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {images.map((image) => (
              <article
                className="rounded-md border border-gray-200 bg-white p-4 sm:p-5"
                key={image.id}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Image
                      alt=""
                      className="size-16 rounded object-cover"
                      height={64}
                      src={image.imagePath}
                      unoptimized
                      width={64}
                    />
                    <div>
                      <p className="font-bold text-gray-900">{image.title}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {image.category.name} · order {image.sortOrder}
                      </p>
                      <span
                        className={`mt-2 inline-flex rounded-sm px-2 py-1 text-xs font-bold ${image.isPublished ? "bg-secondary-50 text-secondary-800" : "bg-gray-100 text-gray-600"}`}
                      >
                        {image.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  {canPublish ? <GalleryImageDeleteForm image={image} /> : null}
                </div>
                {image.isPublished && !canPublish ? (
                  <p className="text-sm text-gray-600">
                    Published images can only be changed by an administrator.
                  </p>
                ) : (
                  <GalleryImageForm
                    canPublish={canPublish}
                    categories={categories}
                    image={image}
                  />
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
            <p className="font-semibold text-gray-800">
              No matching gallery images
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Add an image above or adjust the current filters.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
