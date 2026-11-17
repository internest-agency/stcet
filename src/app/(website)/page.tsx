import AboutSection from "@/src/components/sections/home/about";
// import HeroSection from "@/src/components/sections/home/hero-section";
import MarqueeSection from "@/src/components/sections/home/marquee";
import DepartmentSection from "@/src/components/sections/home/departments";
import FacilitiesMarquee from "@/src/components/sections/home/facilities-marquee";
import AdmissionsSection from "@/src/components/sections/home/admissions";
import WhyChooseAlterSection from "@/src/components/sections/home/why-choose-alter";
import GallerySection, {
  HomeGalleryItem,
} from "@/src/components/sections/home/gallery";
import { getHomeGalleryItems } from "@/src/lib/queries/gallery";
import { getPublicAdmissionsData } from "@/src/lib/queries/admissions";
import { getPageMetadata } from "@/src/lib/queries/seo";
import { getSiteSettings, parseSocialLinks } from "@/src/lib/admin/settings";
import { getSiteUrl } from "@/src/lib/site-url";
import HeroSection1 from "@/src/components/sections/home/hero-sectoin-1";

const PAGE_PATH = "/";

export const generateMetadata = async () => {
  return getPageMetadata(PAGE_PATH, {
    title: "STCET | College Website",
    description: "A modern college website built with Next.js",
  });
};

export default async function HomePage() {
  const [homeGallery, admissionsData, settings] = await Promise.all([
    getHomeGalleryItems(),
    getPublicAdmissionsData(),
    getSiteSettings(),
  ]);

  const siteUrl = getSiteUrl();
  const collegeName =
    settings.collegeName ||
    "S. Thangapazham College of Engineering and Technology";
  const logoUrl = settings.logoPath
    ? `${siteUrl}${settings.logoPath}`
    : `${siteUrl}/images/logo.png`;
  const socialLinks = parseSocialLinks(settings.socialLinks).valid.map(
    (item) => item.href,
  );

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EducationalOrganization", "CollegeOrUniversity"],
        "@id": `${siteUrl}/#organization`,
        name: collegeName,
        alternateName: [
          "STCET",
          "S. Thangapazham College of Engineering & Technology",
        ],
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
        image: `${siteUrl}/images/campus.webp`,
        description:
          settings.defaultMetaDescription ||
          "S. Thangapazham College of Engineering and Technology (STCET) is a premier engineering institution in Vasudevanallur, Tenkasi, Tamil Nadu, offering AICTE-approved undergraduate programmes in engineering and technology.",
        telephone: settings.phoneNumber || "+91 96003 12030",
        email: settings.contactEmail || "stcet2026@gmail.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Vasudevanallur",
          addressLocality: "Tenkasi District",
          addressRegion: "Tamil Nadu",
          postalCode: "627758",
          addressCountry: "IN",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: settings.phoneNumber || "+91 96003 12030",
            contactType: "admissions",
            email: settings.contactEmail || "stcet2026@gmail.com",
            areaServed: "IN",
            availableLanguage: ["English", "Tamil"],
          },
        ],
        ...(socialLinks.length > 0 ? { sameAs: socialLinks } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: collegeName,
        description:
          settings.defaultMetaDescription ||
          "A modern college website built with Next.js",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
      },
    ],
  };

  const departments = [
    {
      id: "01",
      name: "Computer Science and Engineering",
      image: "/images/computer-science-engineering.jpg",
      description:
        "Build expertise in software development, computing systems, artificial intelligence, and emerging technologies.",
      href: "/courses/computer-science-engineering",
    },
    {
      id: "02",
      name: "Computer Science and Engineering (AI/ML)",
      image: "/images/artificial-intelligence.jpg",
      description:
        "Explore artificial intelligence and machine learning through practical learning, innovation, and advanced computing.",
      href: "/courses/computer-science-ai-ml",
    },
    {
      id: "03",
      name: "Information Technology",
      image: "/images/information-technology.jpg",
      description:
        "Develop strong foundations in information systems, software technologies, networking, and digital transformation.",
      href: "/courses/information-technology",
    },
    {
      id: "04",
      name: "Electronics and Communication Engineering",
      image: "/images/artificial-intelligence.jpg",
      description:
        "Learn electronics, communication systems, embedded technologies, signal processing, and modern digital systems.",
      href: "/courses/electronics-communication-engineering",
    },
    {
      id: "05",
      name: "Electrical and Electronics Engineering",
      image: "/images/electrical-engineering.jpg",
      description:
        "Gain practical knowledge in electrical systems, power engineering, automation, control systems, and electronics.",
      href: "/courses/electrical-electronics-engineering",
    },
  ];

  const homeGalleryItems: HomeGalleryItem[] | undefined =
    homeGallery.length > 0
      ? homeGallery.map((item, idx) => ({
          number: String(idx + 1).padStart(2, "0"),
          title: item.title,
          image: item.image,
        }))
      : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* <HeroSection /> */}
      <HeroSection1 />
      <MarqueeSection />
      <AboutSection />
      <DepartmentSection departmentList={departments} />
      <FacilitiesMarquee />
      <WhyChooseAlterSection />
      <GallerySection initialItems={homeGalleryItems} />
      <AdmissionsSection intro={admissionsData?.intro} />
    </>
  );
}
