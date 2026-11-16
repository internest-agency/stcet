import type { Metadata } from "next";
import { Josefin_Sans, Nunito_Sans } from "next/font/google";
import { getSiteSettings } from "@/src/lib/admin/settings";
import { renderCustomCode } from "@/src/lib/custom-code";
import { getSiteUrl } from "@/src/lib/site-url";
import "./globals.css";

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "STCET | College Website",
  description: "A modern college website built with Next.js",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();
  const headCode = renderCustomCode(settings.customHeadCode);
  const bodyEndCode = renderCustomCode(settings.customBodyEndCode);

  return (
    <html
      lang="en"
      className={`${josefinSans.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      {headCode ? <head>{headCode}</head> : null}
      <body suppressHydrationWarning>
        {children}
        {bodyEndCode}
      </body>
    </html>
  );
}
