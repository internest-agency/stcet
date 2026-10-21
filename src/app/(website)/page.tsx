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
import { getPublicGalleryData } from "@/src/lib/queries/gallery";
import { getPublicAdmissionsData } from "@/src/lib/queries/admissions";
import { getPageSeo } from "@/src/lib/queries/seo";
import HeroSection1 from "@/src/components/sections/home/hero-sectoin-1";

const PAGE_PATH = "/";

export const generateMetadata = async () => {
  const seo = await getPageSeo(PAGE_PATH);

  return {
    title: seo.seoTitle || "STCET | College Website",
    description:
      seo.metaDescription || "A modern college website built with Next.js",
  };
};

export default async function HomePage() {
  const [galleryData, admissionsData] = await Promise.all([
    getPublicGalleryData(),
    getPublicAdmissionsData(),
  ]);

  const seo = await getPageSeo(PAGE_PATH);

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
    galleryData.items && galleryData.items.length > 0
      ? galleryData.items.map((item, idx) => ({
          number: String(idx + 1).padStart(2, "0"),
          title: item.title,
          image: item.image,
        }))
      : undefined;

  return (
    <>
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
