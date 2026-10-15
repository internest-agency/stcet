import Image from "next/image";
import RichText from "@/src/components/ui/RichText";
import { containsHtml } from "@/src/lib/content/html";
import {
  resolveSectionLayout,
  type SectionLayoutId,
} from "@/src/lib/content/section-layouts";

export interface InstitutionalSectionData {
  id: number;
  title: string;
  content: string | null;
  imagePath: string | null;
  layout: string;
}

const headingClass = "text-2xl font-bold text-primary-800";

/**
 * Renders a section's stored content. HTML is sanitized through `RichText`;
 * legacy plain-text content keeps its line breaks so nothing is lost when an
 * older record has not been re-authored in the rich-text editor yet.
 */
function SectionContent({
  content,
  className,
}: {
  content: string | null;
  className?: string;
}) {
  if (!content || !content.trim()) return null;

  if (containsHtml(content)) {
    return (
      <RichText
        className={className ? `mt-4 ${className}` : "mt-4"}
        html={content}
      />
    );
  }

  return (
    <p
      className={`mt-4 whitespace-pre-line leading-7 text-gray-700 ${
        className ?? ""
      }`}
    >
      {content}
    </p>
  );
}

function FillImage({
  src,
  alt,
  className,
  aspect,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  aspect: string;
  sizes: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl ${aspect} ${className ?? ""}`}>
      <Image
        alt={alt}
        className="object-cover"
        fill
        sizes={sizes}
        src={src}
        unoptimized
      />
    </div>
  );
}

export default function InstitutionalSection({
  section,
}: {
  section: InstitutionalSectionData;
}) {
  const layout: SectionLayoutId = resolveSectionLayout(section.layout);
  const image = section.imagePath;

  const heading = <h2 className={headingClass}>{section.title}</h2>;

  let body: React.ReactNode;

  switch (layout) {
    case "image-left":
    case "image-right": {
      const imageFirst = layout === "image-left";
      const media = image ? (
        <FillImage
          alt={section.title}
          aspect="aspect-4/3"
          sizes="(max-width: 1024px) 100vw, 576px"
          src={image}
        />
      ) : null;
      const text = (
        <div>
          {heading}
          <SectionContent content={section.content} />
        </div>
      );
      body = (
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {imageFirst ? (
            <>
              {media}
              {text}
            </>
          ) : (
            <>
              {text}
              {media}
            </>
          )}
        </div>
      );
      break;
    }

    case "image-banner":
      body = (
        <div>
          {image ? (
            <FillImage
              alt={section.title}
              aspect="aspect-16/6"
              className="mb-6"
              sizes="(max-width: 1024px) 100vw, 1152px"
              src={image}
            />
          ) : null}
          {heading}
          <SectionContent content={section.content} />
        </div>
      );
      break;

    case "highlight":
      body = (
        <div className="rounded-2xl border border-primary-100 bg-primary-50 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-primary-900">
            {section.title}
          </h2>
          <SectionContent content={section.content} className="text-primary-900" />
        </div>
      );
      break;

    case "two-column":
      body = (
        <div>
          {image ? (
            <FillImage
              alt={section.title}
              aspect="aspect-16/6"
              className="mb-6"
              sizes="(max-width: 1024px) 100vw, 1152px"
              src={image}
            />
          ) : null}
          {heading}
          <SectionContent
            className="two-col-flow sm:columns-2 sm:gap-x-10"
            content={section.content}
          />
        </div>
      );
      break;

    case "full-width":
      body = (
        <div>
          {heading}
          <SectionContent content={section.content} />
          {image ? (
            <FillImage
              alt={section.title}
              aspect="aspect-16/9"
              className="mt-6"
              sizes="(max-width: 1024px) 100vw, 1152px"
              src={image}
            />
          ) : null}
        </div>
      );
      break;

    // "standard" and any unknown value (already coerced by resolveSectionLayout)
    default:
      body = (
        <div>
          {heading}
          <SectionContent content={section.content} />
          {image ? (
            <FillImage
              alt={section.title}
              aspect="aspect-16/9"
              className="mt-6 max-w-3xl"
              sizes="(max-width: 1024px) 100vw, 768px"
              src={image}
            />
          ) : null}
        </div>
      );
      break;
  }

  return (
    <section className="border-b border-gray-200 pb-12 last:border-b-0">
      {body}
    </section>
  );
}
