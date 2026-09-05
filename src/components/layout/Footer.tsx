import Container from "../ui/Container";
import Link from "next/link";
import { FiPhoneCall } from "react-icons/fi";
import { BsEnvelope } from "react-icons/bs";
import { IoHeart } from "react-icons/io5";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[url('/images/boys-hostel.webp')] bg-cover bg-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-primary-800/95" />

      {/* Main footer */}
      <Container className="relative z-10 pt-16 pb-8 text-white sm:pt-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Address */}
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-accent-300">
              Address
            </p>

            <address className="not-italic text-sm leading-7 text-white/80 sm:text-base">
              S. Thangapazham College of Engineering and Technology,
              <br />
              Vasudevanallur, Tenkasi District,
              <br />
              Tamil Nadu, India - 627758.
            </address>
          </div>

          {/* Important Links */}
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-accent-300">
              Important Links
            </p>

            <ul className="space-y-2.5 text-sm sm:text-base">
              <li>
                <Link
                  href="/aicte-approval"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  AICTE Approval
                </Link>
              </li>

              <li>
                <Link
                  href="/anna-university-affiliation"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  Anna University Affiliation
                </Link>
              </li>

              <li>
                <Link
                  href="/anti-ragging"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  Anti-Ragging Committee
                </Link>
              </li>

              <li>
                <Link
                  href="/internal-complaints-committee"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  Internal Complaints Committee (ICC)
                </Link>
              </li>

              <li>
                <Link
                  href="/grievance-redressal"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  Grievance Redressal Cell
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-accent-300">
              Quick Links
            </p>

            <ul className="space-y-2.5 text-sm sm:text-base">
              <li>
                <Link
                  href="/"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-accent-300">
              Contact
            </p>

            <ul className="space-y-3 text-sm sm:text-base">
              <li>
                <Link
                  href="tel:+919600312030"
                  className="flex items-center gap-3 text-white/80 transition-colors duration-200 hover:text-white"
                >
                  <FiPhoneCall
                    className="shrink-0 text-accent-300"
                    aria-hidden="true"
                  />

                  <span>+91 96003 12030</span>
                </Link>
              </li>

              <li>
                <Link
                  href="tel:04636241644"
                  className="flex items-center gap-3 text-white/80 transition-colors duration-200 hover:text-white"
                >
                  <FiPhoneCall
                    className="shrink-0 text-accent-300"
                    aria-hidden="true"
                  />

                  <span>04636 241 644</span>
                </Link>
              </li>

              <li>
                <Link
                  href="mailto:stcet2026@gmail.com"
                  className="flex items-center gap-3 break-all text-white/80 transition-colors duration-200 hover:text-white"
                >
                  <BsEnvelope
                    className="shrink-0 text-accent-300"
                    aria-hidden="true"
                  />

                  <span>stcet2026@gmail.com</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Copyright */}
      <div className="relative z-10 border-t border-white/15">
        <Container className="py-5 text-white">
          <div className="flex flex-col gap-3 text-center text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>&copy; {new Date().getFullYear()} STCET. All rights reserved.</p>

            <p className="flex items-center justify-center gap-1.5 sm:justify-end">
              <span>Made with</span>

              <IoHeart className="text-red-500" aria-hidden="true" />

              <span>by</span>

              <Link
                href="https://www.example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white transition-colors duration-200 hover:text-accent-300"
              >
                Example
              </Link>
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
