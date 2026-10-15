import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/src/components/ui/Container";
import EditorialHero from "@/src/components/ui/EditorialHero";
import InstitutionalSection from "@/src/components/sections/institutional/InstitutionalSection";
import { getPublishedInstitutionalPage } from "@/src/lib/queries/institutional-pages";

export async function generateMetadata({ params }: { params: Promise<{ institutionalSlug: string }> }): Promise<Metadata> { const { institutionalSlug } = await params; const page = await getPublishedInstitutionalPage(institutionalSlug); if (!page) return {}; return { title: page.seoTitle || `${page.title} | STCET`, description: page.metaDescription || page.introduction || undefined, robots: { index: true, follow: true } }; }

export default async function InstitutionalPublicPage({ params }: { params: Promise<{ institutionalSlug: string }> }) {
  const { institutionalSlug } = await params;
  const page = await getPublishedInstitutionalPage(institutionalSlug);
  if (!page) notFound();

  const heroImage =
    page.sections.find((section) => section.imagePath)?.imagePath ||
    "/images/committee-hero.webp";

  return (
    <>
      <EditorialHero image={heroImage} imageAlt={page.title}>
        <h1 className="text-4xl font-extrabold text-white">{page.title}</h1>
        {page.introduction ? (
          <p className="mt-6 max-w-2xl text-white/80">{page.introduction}</p>
        ) : null}
      </EditorialHero>
      <Container className="space-y-12 py-14 sm:py-20">
        {page.sections.map((section) => (
          <InstitutionalSection key={section.id} section={section} />
        ))}
      </Container>
    </>
  );
}
