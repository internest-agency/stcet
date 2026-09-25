"use client";

import { FormEvent, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { FiArrowUpRight, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";

const contactDetails = {
  address: {
    line1: "S. Thangapazham College of Engineering & Technology",
    line2: "Tamil Nadu, India",
  },
  phone: "+919600312030",
  email: "stcet2026@gmail.com",
};

export default function ContactMain() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const context = gsap.context(() => {
      const elements = section.querySelectorAll(".contact-reveal");

      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
          },
        },
      );
    }, section);

    return () => context.revert();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Connect your form submission here.
  };

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-white py-14 sm:py-18 lg:py-20"
    >
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20 xl:grid-cols-[0.7fr_1.3fr]">
          {/* =========================================================
              LEFT — CONTACT INFORMATION
          ========================================================= */}

          <div className="contact-reveal">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.22em] text-gray-400">
              Contact
            </p>

            <SectionHeading as="h2">
              Tell Us How <span className="text-accent-400">We Can Help.</span>
            </SectionHeading>

            <p className="mt-7 max-w-md text-gray-600">
              Whether you are a prospective student, parent or visitor, our team
              is here to help with your questions and provide the information
              you need about STCET.
            </p>

            {/* Contact Details */}
            <div className="mt-12">
              <p className="mb-7 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                Get in Touch
              </p>

              <div className="space-y-8">
                {/* Address */}
                <div className="flex gap-4">
                  <div className="mt-0.5 shrink-0 text-xl text-accent-400">
                    <FiMapPin aria-hidden="true" />
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold text-primary-800">
                      Campus Address
                    </p>

                    <address className="not-italic text-base leading-7 text-gray-600">
                      <span className="block">
                        {contactDetails.address.line1}
                      </span>

                      <span className="block">
                        {contactDetails.address.line2}
                      </span>
                    </address>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="mt-0.5 shrink-0 text-xl text-accent-400">
                    <FiPhone aria-hidden="true" />
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold text-primary-800">
                      Phone
                    </p>

                    <a
                      href={`tel:${contactDetails.phone.replace(/\s/g, "")}`}
                      className="text-base text-gray-600 transition-colors duration-200 hover:text-accent-400"
                    >
                      {contactDetails.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="mt-0.5 shrink-0 text-xl text-accent-400">
                    <FiMail aria-hidden="true" />
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold text-primary-800">
                      Email
                    </p>

                    <a
                      href={`mailto:${contactDetails.email}`}
                      className="text-base text-gray-600 transition-colors duration-200 hover:text-accent-400"
                    >
                      {contactDetails.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              RIGHT — CONTACT FORM
          ========================================================= */}

          <div id="application" className="contact-reveal">
            <div className="mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                Send an Enquiry
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-3 block text-sm font-medium text-primary-800"
                  >
                    Full Name
                  </label>

                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className="
                      w-full
                      border-0
                      border-b
                      border-gray-300
                      bg-transparent
                      px-0
                      py-3
                      text-base
                      text-primary-800
                      outline-none
                      transition-colors
                      duration-200
                      placeholder:text-gray-400
                      focus:border-primary-800
                    "
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-3 block text-sm font-medium text-primary-800"
                  >
                    Email Address
                  </label>

                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Your email address"
                    className="
                      w-full
                      border-0
                      border-b
                      border-gray-300
                      bg-transparent
                      px-0
                      py-3
                      text-base
                      text-primary-800
                      outline-none
                      transition-colors
                      duration-200
                      placeholder:text-gray-400
                      focus:border-primary-800
                    "
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="mb-3 block text-sm font-medium text-primary-800"
                  >
                    Phone Number
                  </label>

                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="Your phone number"
                    className="
                      w-full
                      border-0
                      border-b
                      border-gray-300
                      bg-transparent
                      px-0
                      py-3
                      text-base
                      text-primary-800
                      outline-none
                      transition-colors
                      duration-200
                      placeholder:text-gray-400
                      focus:border-primary-800
                    "
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-3 block text-sm font-medium text-primary-800"
                  >
                    Subject
                  </label>

                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="How can we help?"
                    className="
                      w-full
                      border-0
                      border-b
                      border-gray-300
                      bg-transparent
                      px-0
                      py-3
                      text-base
                      text-primary-800
                      outline-none
                      transition-colors
                      duration-200
                      placeholder:text-gray-400
                      focus:border-primary-800
                    "
                  />
                </div>

                {/* Message */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="contact-message"
                    className="mb-3 block text-sm font-medium text-primary-800"
                  >
                    Message
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="
                      w-full
                      resize-none
                      border-0
                      border-b
                      border-gray-300
                      bg-transparent
                      px-0
                      py-3
                      text-base
                      text-primary-800
                      outline-none
                      transition-colors
                      duration-200
                      placeholder:text-gray-400
                      focus:border-primary-800
                    "
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="mt-10">
                <button
                  type="submit"
                  className="
                    inline-flex
                    items-center
                    gap-3
                    bg-primary-800
                    px-7
                    py-4
                    text-sm
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-white
                    transition-colors
                    duration-200
                    hover:bg-accent-400
                  "
                >
                  <span>Send Message</span>

                  <FiArrowUpRight aria-hidden="true" className="text-lg" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
