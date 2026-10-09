import type { Metadata } from "next";
import { Josefin_Sans, Nunito_Sans } from "next/font/google";
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
  title: "STCET | College Website",
  description: "A modern college website built with Next.js",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${josefinSans.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
