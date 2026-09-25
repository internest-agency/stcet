"use client";

import { FiArrowUpRight, FiMapPin } from "react-icons/fi";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

export default function ContactMap() {
  return (
    <section className="overflow-hidden bg-gray-100 py-14 sm:py-18 lg:py-20">
      <Container>
        {/* Section Heading */}
        <div className="mb-10">
          <SectionHeading as="h2" className="text-center">
            Visit Our <span className="text-accent-400">Campus.</span>
          </SectionHeading>
        </div>

        {/* Map Area */}
        <div className="relative">
          {/* Google Map */}
          <div className="relative aspect-[16/7] min-h-[400px] w-full overflow-hidden sm:min-h-[400px] lg:min-h-[480px]">
            <iframe
              title="S. Thangapazham College of Engineering & Technology location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1968.9238610648977!2d77.39888979823965!3d9.25789983241468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0692274960ae49%3A0xf39171ab609456cb!2sS.Thangapazham%20Agricultural%20College!5e0!3m2!1sen!2sin!4v1790304548249!5m2!1sen!2sin"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Editorial Information Panel */}
          <div className="relative bg-white px-7 py-8 sm:px-10 sm:py-10 lg:absolute lg:bottom-8 lg:left-8 lg:w-[420px] lg:px-10 lg:py-10 xl:bottom-10 xl:left-10">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
              Visit Our Campus
            </p>

            <SectionHeading as="h3">
              S. Thangapazham College of Engineering & Technology
            </SectionHeading>

            <div className="mt-6 flex gap-4">
              <div className="mt-1 shrink-0 text-xl text-accent-400">
                <FiMapPin aria-hidden="true" />
              </div>

              <address className="not-italic text-base leading-7 text-gray-600">
                <span className="block">
                  Vasudevanallur, Tenkasi District, Tamil Nadu, India - 627758.
                </span>
              </address>
            </div>

            <p className="mt-6 text-sm leading-6 text-gray-500">
              Visit our campus and experience the learning environment,
              facilities and community at STCET.
            </p>

            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.12em] text-primary-800 transition-colors duration-200 hover:text-accent-400"
            >
              <span>Get Directions</span>

              <FiArrowUpRight aria-hidden="true" className="text-lg" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
