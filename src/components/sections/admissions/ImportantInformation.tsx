"use client";

import Link from "next/link";
import { ExternalLink, Info } from "lucide-react";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

export type ImportantNoticeItem = {
  id: number;
  title: string;
  content: string;
  linkUrl: string | null;
};

export type ApplicationLinkItem = {
  id: number;
  name: string;
  url: string;
};

interface ImportantInformationProps {
  notices?: ImportantNoticeItem[];
  links?: ApplicationLinkItem[];
}

export default function ImportantInformation({
  notices,
  links,
}: ImportantInformationProps = {}) {
  const hasDynamicNotices = notices && notices.length > 0;
  const hasDynamicLinks = links && links.length > 0;

  return (
    <section className="overflow-hidden bg-gray-50 py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mb-10">
          <div className="mb-5 flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-800/50">
              Important Information
            </span>
          </div>

          <SectionHeading as="h2">Important Before You Apply</SectionHeading>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {hasDynamicNotices ? (
            notices.map((notice) => (
              <div
                key={notice.id}
                className="flex items-start gap-5 rounded-xl border border-blue-100 bg-blue-50/80 p-7 sm:p-9"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                  <Info size={21} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-primary-900 mb-1">
                    {notice.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {notice.content}
                  </p>
                  {notice.linkUrl && (
                    <Link
                      href={notice.linkUrl}
                      target="_blank"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 hover:underline"
                    >
                      Read notice document <ExternalLink size={13} />
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-5 rounded-xl border border-blue-100 bg-blue-50 p-7 sm:p-9">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                <Info size={21} />
              </div>

              <div>
                <p className="font-bold leading-6 text-primary-800">
                  Tamil Nadu native candidates alone will be considered for
                  communal reservation.
                </p>
              </div>
            </div>
          )}

          {hasDynamicLinks ? (
            links.map((linkItem) => (
              <Link
                key={linkItem.id}
                href={linkItem.url}
                target="_blank"
                className="group flex items-center justify-between gap-6 rounded-xl border border-gray-200 bg-white p-7 shadow-sm transition hover:border-primary-300 hover:shadow-md sm:p-9"
              >
                <div>
                  <p className="text-[10px] mb-3 font-bold uppercase tracking-[0.16em] text-primary-800/45">
                    Official Resource
                  </p>

                  <SectionHeading as="h3">{linkItem.name}</SectionHeading>

                  <p className="mt-2 text-[14px] text-gray-500">
                    View and download official admission materials.
                  </p>
                </div>

                <ExternalLink
                  size={20}
                  className="shrink-0 text-primary-800 transition-transform group-hover:translate-x-1"
                />
              </Link>
            ))
          ) : (
            <Link
              href="https://static.tneaonline.org/docs/2_Information_Brochure_2026.pdf"
              target="_blank"
              className="group flex items-center justify-between gap-6 rounded-xl border border-gray-200 bg-white p-7 shadow-sm transition hover:border-primary-300 hover:shadow-md sm:p-9"
            >
              <div>
                <p className="text-[10px] mb-4 font-bold uppercase tracking-[0.16em] text-primary-800/45">
                  Official Document
                </p>

                <SectionHeading as="h3">
                  TNEA Information Brochure 2026
                </SectionHeading>

                <p className="mt-2 text-[14px] text-gray-500">
                  View and download the official TNEA information brochure.
                </p>
              </div>

              <ExternalLink
                size={20}
                className="shrink-0 text-primary-800 transition-transform group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>
      </Container>
    </section>
  );
}
