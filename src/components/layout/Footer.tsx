import type { ComponentType } from "react";
import Container from "../ui/Container";
import Link from "next/link";
import { FiPhoneCall } from "react-icons/fi";
import { BsEnvelope } from "react-icons/bs";
import { FaFacebook, FaYoutube, FaLinkedin } from "react-icons/fa";
import { PiInstagramLogoFill } from "react-icons/pi";
import { FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa6";
import {
  getSiteSettings,
  parseSocialLinks,
  SocialLinksConfig,
} from "@/src/lib/admin/settings";

const socialNetworks = Object.entries(SocialLinksConfig).map(([key, label]) => {
  let Icon: ComponentType<{ "aria-hidden"?: boolean; className?: string }>;
  switch (key) {
    case "instagram":
      Icon = PiInstagramLogoFill;
      break;
    case "facebook":
      Icon = FaFacebook;
      break;
    case "youtube":
      Icon = FaYoutube;
      break;
    case "linkedin":
      Icon = FaLinkedin;
      break;
    case "x":
      Icon = FaXTwitter;
      break;
    case "whatsapp":
      Icon = FaWhatsapp;
      break;
    default:
      const PlaceholderIcon: React.FC = () => null;
      Icon = PlaceholderIcon;
  }
  return { key, label, Icon };
});

interface FooterNavLink {
  label: string;
  url: string;
}

function parseFooterLinks(value: unknown): {
  importantLinks: FooterNavLink[];
  quickLinks: FooterNavLink[];
} {
  const importantLinks: FooterNavLink[] = [];
  const quickLinks: FooterNavLink[] = [];

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { importantLinks, quickLinks };
  }

  const obj = value as Record<string, unknown>;

  // Process importantLinks
  const importantRaw = obj["importantLinks"];
  if (Array.isArray(importantRaw)) {
    importantRaw.forEach((item: unknown) => {
      if (typeof item === "object" && item !== null) {
        const candidate = item as Record<string, unknown>;
        if (
          typeof candidate.label === "string" &&
          typeof candidate.url === "string"
        ) {
          importantLinks.push({ label: candidate.label, url: candidate.url });
        }
      }
    });
  }

  // Process quickLinks
  const quickRaw = obj["quickLinks"];
  if (Array.isArray(quickRaw)) {
    quickRaw.forEach((item: unknown) => {
      if (typeof item === "object" && item !== null) {
        const candidate = item as Record<string, unknown>;
        if (
          typeof candidate.label === "string" &&
          typeof candidate.url === "string"
        ) {
          quickLinks.push({ label: candidate.label, url: candidate.url });
        }
      }
    });
  }

  return { importantLinks, quickLinks };
}

const footerLinkClass =
  "block w-fit max-w-full break-words text-white/80 transition-colors duration-200 hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-300";

const footerHeadingClass =
  "mb-4 text-sm font-bold uppercase tracking-[0.15em] text-accent-300";

export default async function Footer({
  address,
  contactEmail,
  phoneNumber,
  altPhone,
  collegeName,
}: {
  address: string | null;
  contactEmail: string | null;
  phoneNumber: string | null;
  altPhone: string | null;
  collegeName: string | null;
}) {
  const settings = await getSiteSettings();
  const { importantLinks, quickLinks } = parseFooterLinks(
    settings.footerLinks ?? null,
  );
  const { valid: configuredLinks } = parseSocialLinks(settings.socialLinks);

  // Attach icons to the parsed social links
  const linksWithIcons = configuredLinks.map((link) => {
    const network = socialNetworks.find((n) => n.key === link.key);
    return { ...link, Icon: network?.Icon ?? (() => null) };
  });

  return (
    <footer className="relative overflow-hidden bg-[url('/images/boys-hostel.webp')] bg-cover bg-center">
      <div aria-hidden="true" className="absolute inset-0 bg-primary-800/95" />

      <Container className="relative z-10 py-12 text-white sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <section aria-labelledby="footer-address-heading" className="min-w-0">
            <h2 className={footerHeadingClass} id="footer-address-heading">
              Address
            </h2>
            <address className="max-w-[34ch] break-words text-sm leading-7 text-white/80 sm:text-base not-italic">
              {collegeName ??
                "S. Thangapazham College of Engineering and Technology"}
              <br />
              {address ??
                "Vasudevanallur, Tenkasi District, Tamil Nadu, India - 627758."}
            </address>
          </section>

          <nav aria-labelledby="footer-important-heading" className="min-w-0">
            <h2 className={footerHeadingClass} id="footer-important-heading">
              Important Links
            </h2>
            {importantLinks.length > 0 ? (
              <ul className="space-y-2.5 text-sm sm:text-base">
                {importantLinks.map((item, index) => (
                  <li key={index}>
                    <Link className={footerLinkClass} href={item.url}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2.5 text-sm sm:text-base">
                <li>
                  <Link className={footerLinkClass} href="/iqac">
                    IQAC
                  </Link>
                </li>
                <li>
                  <Link
                    className={footerLinkClass}
                    href="/anti-ragging-committee"
                  >
                    Anti Ragging Committee
                  </Link>
                </li>
                <li>
                  <Link
                    className={footerLinkClass}
                    href="/grievance-redressal-committee"
                  >
                    Grievance Redressal Committee
                  </Link>
                </li>
                <li>
                  <Link
                    className={footerLinkClass}
                    href="/internal-complaints-committee"
                  >
                    Internal Complaints Committee (ICC)
                  </Link>
                </li>
                <li>
                  <Link className={footerLinkClass} href="/sc-st-cell">
                    SC/ST Cell
                  </Link>
                </li>
              </ul>
            )}
          </nav>

          <nav aria-labelledby="footer-quick-heading" className="min-w-0">
            <h2 className={footerHeadingClass} id="footer-quick-heading">
              Quick Links
            </h2>
            {quickLinks.length > 0 ? (
              <ul className="space-y-2.5 text-sm sm:text-base">
                {quickLinks.map((item, index) => (
                  <li key={index}>
                    <Link className={footerLinkClass} href={item.url}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2.5 text-sm sm:text-base">
                <li>
                  <Link className={footerLinkClass} href="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className={footerLinkClass} href="/about">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    className={footerLinkClass}
                    href="/enquire-now#application"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link className={footerLinkClass} href="/gallery">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link className={footerLinkClass} href="/scholarships">
                    Scholarships
                  </Link>
                </li>
              </ul>
            )}
          </nav>

          <section aria-labelledby="footer-contact-heading" className="min-w-0">
            <h2 className={footerHeadingClass} id="footer-contact-heading">
              Contact & Social Media
            </h2>
            <ul className="space-y-3 text-sm sm:text-base">
              <li>
                <a
                  className="flex min-w-0 items-start gap-3 text-white/80 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-300"
                  href={`tel:${phoneNumber ?? "+919600312030"}`}
                >
                  <FiPhoneCall
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-accent-300"
                  />
                  <span>{phoneNumber ?? "+91 96003 12030"}</span>
                </a>
              </li>
              {altPhone ? (
                <li>
                  <a
                    className="flex min-w-0 items-start gap-3 text-white/80 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-offset-4 focus-visible:outline-accent-300"
                    href={`tel:${altPhone}`}
                  >
                    <FiPhoneCall
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-accent-300"
                    />
                    <span>{altPhone}</span>
                  </a>
                </li>
              ) : null}
              <li>
                <a
                  className="flex min-w-0 items-start gap-3 text-white/80 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-300"
                  href={`mailto:${contactEmail ?? "stcet2026@gmail.com"}`}
                >
                  <BsEnvelope
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-accent-300"
                  />
                  <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                    {contactEmail ?? "stcet2026@gmail.com"}
                  </span>
                </a>
              </li>
            </ul>

            {linksWithIcons.length > 0 ? (
              <nav aria-label="Social media" className="mt-6">
                <ul className="flex flex-wrap gap-2.5">
                  {linksWithIcons.map(({ key, label, Icon, href }) => (
                    <li key={key}>
                      <a
                        aria-label={label}
                        className="grid size-10 place-items-center rounded-full text-accent-300 bg-white/10 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300"
                        href={href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Icon aria-hidden className="text-xl" />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </section>
        </div>
      </Container>

      <div className="relative z-10 border-t border-white/15">
        <Container className="py-5 text-center text-sm text-white/70">
          <p>&copy; {new Date().getFullYear()} STCET. All rights reserved.</p>
        </Container>
      </div>
    </footer>
  );
}

Footer.displayName = "Footer";
