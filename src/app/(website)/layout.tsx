import Footer from "@/src/components/layout/Footer";
import Header from "@/src/components/layout/Header";
import GoToTop from "@/src/components/ui/GoToTop";
import HashScroll from "@/src/components/ui/HashScroll";
import SmoothScroll from "@/src/components/ui/SmoothScroll";
import WhatsAppChat from "@/src/components/ui/WhatsAppChat";
import { getSiteSettings } from "@/src/lib/admin/settings";
import { getSiteUrl } from "@/src/lib/site-url";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  const favicon = settings.faviconPath
    ? `${getSiteUrl()}${settings.faviconPath}`
    : undefined;

  return (
    <>
      {favicon && <link rel="icon" href={favicon} type="image/svg+xml" />}
      <Header collegeName={settings.collegeName} logoPath={settings.logoPath} />
      <SmoothScroll>
        <HashScroll />
        <main>{children}</main>
        <Footer
          address={settings.address}
          contactEmail={settings.contactEmail}
          phoneNumber={settings.phoneNumber}
          altPhone={settings.alternativePhone}
          collegeName={settings.collegeName}
          footerText={settings.footerText}
        />
      </SmoothScroll>
      <GoToTop />
      <WhatsAppChat phoneNumber="919600312030" />
    </>
  );
}
