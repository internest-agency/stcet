"use client";

import Image from "next/image";
import { useEffect, useId, useState, type DragEvent } from "react";
import { ImagePlus, LoaderCircle, Trash2, Upload } from "lucide-react";

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type UploadResponse = {
  path: string;
};

export default function ImageUploadField({
  label,
  category,
  value,
  onChange,
}: {
  label: string;
  category: string;
  value: string;
  onChange: (path: string) => void;
}) {
  const inputId = useId();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function upload(file: File | undefined) {
    if (!file || uploading) return;

    setError("");
    setSuccess("");
    if (file.size > DEFAULT_MAX_BYTES) {
      setError("Choose an image no larger than 5 MB.");
      return;
    }
    if (file.type && !ACCEPTED_TYPES.has(file.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setProgress(0);
    setUploading(true);

    const request = new XMLHttpRequest();
    request.open(
      "POST",
      `/api/admin/media/upload?category=${encodeURIComponent(category)}`,
    );
    request.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream",
    );
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    request.onload = () => {
      setUploading(false);
      if (request.status < 200 || request.status >= 300) {
        setPreviewUrl(null);
        try {
          const response = JSON.parse(request.responseText) as {
            error?: string;
          };
          setError(response.error ?? "Image upload failed. Try again.");
        } catch {
          setError("Image upload failed. Try again.");
        }
        return;
      }

      try {
        const response = JSON.parse(request.responseText) as UploadResponse;
        if (!response.path.startsWith("/uploads/")) {
          throw new Error("Invalid upload response.");
        }
        onChange(response.path);
        setPreviewUrl(null);
        setSuccess("Image uploaded. Save the course to apply it.");
      } catch {
        setPreviewUrl(null);
        setError("The upload completed but could not be selected. Try again.");
      }
    };
    request.onerror = () => {
      setUploading(false);
      setPreviewUrl(null);
      setError(
        "Network error while uploading. Your current image is unchanged.",
      );
    };
    request.onabort = () => {
      setUploading(false);
      setPreviewUrl(null);
      setError("Upload cancelled. Your current image is unchanged.");
    };
    request.send(file);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    upload(event.dataTransfer.files[0]);
  }

  const imageSource = previewUrl ?? value;

  return (
    <div className="block text-sm font-semibold text-gray-700">
      <span className="mb-1.5 block">{label}</span>
      <input
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="sr-only"
        disabled={uploading}
        id={inputId}
        onChange={(event) => upload(event.target.files?.[0])}
        type="file"
      />
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <label
          className={`flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-5 text-center transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary-700 ${dragging ? "border-primary-600 bg-primary-50" : "border-gray-300 bg-gray-50 hover:border-primary-500 hover:bg-primary-50/50"} ${uploading ? "cursor-wait opacity-75" : ""}`}
          htmlFor={inputId}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragging(false);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDrop}
        >
          {uploading ? (
            <LoaderCircle
              aria-hidden
              className="size-6 animate-spin text-primary-700"
            />
          ) : value || previewUrl ? (
            <Upload aria-hidden className="size-6 text-primary-700" />
          ) : (
            <ImagePlus aria-hidden className="size-6 text-gray-500" />
          )}
          <span className="mt-2 font-bold text-gray-800">
            {uploading
              ? `Uploading ${progress}%`
              : value
                ? "Replace image"
                : "Select or drop an image"}
          </span>
          <span className="mt-1 text-xs font-normal text-gray-500">
            JPEG, PNG, or WebP · maximum 5 MB
          </span>
          {uploading ? (
            <span className="mt-3 h-1.5 w-full max-w-56 overflow-hidden rounded-full bg-gray-200">
              <span
                className="block h-full bg-primary-600 transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </span>
          ) : null}
        </label>
        <div className="flex min-h-36 flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-3">
          {imageSource ? (
            <>
              <Image
                alt={`${label} preview`}
                className="h-24 w-full rounded object-contain"
                height={96}
                src={imageSource}
                unoptimized
                width={192}
              />
              {value && !previewUrl && !uploading ? (
                <button
                  className="mt-2 inline-flex min-h-8 items-center gap-1.5 rounded px-2 text-xs font-bold text-red-700 hover:bg-red-50"
                  onClick={() => {
                    onChange("");
                    setSuccess("");
                    setError("");
                  }}
                  type="button"
                >
                  <Trash2 aria-hidden className="size-3.5" /> Remove image
                </button>
              ) : null}
            </>
          ) : (
            <span className="text-xs font-medium text-gray-400">
              No image selected
            </span>
          )}
        </div>
      </div>
      {error ? (
        <p
          aria-live="polite"
          className="mt-2 text-xs font-semibold text-red-700"
        >
          {error}
        </p>
      ) : null}
      {success ? (
        <p
          aria-live="polite"
          className="mt-2 text-xs font-semibold text-secondary-800"
        >
          {success}
        </p>
      ) : null}
    </div>
  );
}
