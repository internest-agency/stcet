import AboutSection from "@/src/components/sections/home/about";
import HeroSection from "@/src/components/sections/home/hero-section";
import MarqueeSection from "@/src/components/sections/home/marquee";
import DepartmentSection from "@/src/components/sections/home/departments";
import FacilitiesMarquee from "@/src/components/sections/home/facilities-marquee";
import AdmissionsSection from "@/src/components/sections/home/admissions";
import WhyChooseAlterSection from "@/src/components/sections/home/why-choose-alter";
import GallerySection from "@/src/components/sections/home/gallery";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <DepartmentSection />
      <FacilitiesMarquee />
      <WhyChooseAlterSection />
      <GallerySection />
      <AdmissionsSection />
    </>
  );
}
