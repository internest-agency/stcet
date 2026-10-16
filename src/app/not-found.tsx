import type { Metadata } from "next";

import Footer from "@/src/components/layout/Footer";
import Header from "@/src/components/layout/Header";
import GoToTop from "@/src/components/ui/GoToTop";
import WhatsAppChat from "@/src/components/ui/WhatsAppChat";
import NotFoundContent from "@/src/components/sections/not-found/NotFoundContent";
import { getSiteSettings } from "@/src/lib/admin/settings";
import { getMenuItems } from "@/src/lib/queries/menus";

/*
 * The root not-found boundary handles unmatched URLs for the whole
 * app. It renders inside the bare root layout, so the website chrome
 * (header / footer) is composed here using the same shared components
 * as the (website) route group.
 */

export const metadata: Metadata = {
  title: "Page Not Found | STCET",
  description:
    "The page you are looking for may have moved, been removed, or is no longer available.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NotFound() {
  const [settings, menuItems] = await Promise.all([
    getSiteSettings(),
    getMenuItems(),
  ]);

  return (
    <>
      <Header
        collegeName={settings.collegeName}
        logoPath={settings.logoPath}
        menuItems={menuItems}
      />

      <main>
        <NotFoundContent />
      </main>

      <Footer
        address={settings.address}
        contactEmail={settings.contactEmail}
        phoneNumber={settings.phoneNumber}
        altPhone={settings.alternativePhone}
        collegeName={settings.collegeName}
        footerText={settings.footerText}
      />

      <GoToTop />
      <WhatsAppChat phoneNumber="919600312030" />
    </>
  );
}
