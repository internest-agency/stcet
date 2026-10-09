import type { ReactNode } from "react";
import Footer from "@/src/components/layout/Footer";
import Header from "@/src/components/layout/Header";
import EnquireNow from "@/src/components/ui/EnquireNow";
import GoToTop from "@/src/components/ui/GoToTop";
import SmoothScroll from "@/src/components/ui/SmoothScroll";
import WhatsAppChat from "@/src/components/ui/WhatsAppChat";

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <SmoothScroll>
        <main>{children}</main>
        <Footer />
      </SmoothScroll>
      <GoToTop />
      <WhatsAppChat phoneNumber="919600312030" />
      <EnquireNow />
    </>
  );
}
