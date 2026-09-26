import Container from "../ui/Container";
import Link from "next/link";
import { FiPhoneCall } from "react-icons/fi";
import { BsEnvelope } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { PiInstagramLogoFill } from "react-icons/pi";
import { FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

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
              S. Thangapazham College of <br />
              Engineering and Technology,
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
                  href="/iqac"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  IQAC
                </Link>
              </li>
              <li>
                <Link
                  href="/anti-ragging-committee"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  Anti Ragging Committee
                </Link>
              </li>
              <li>
                <Link
                  href="/grievance-redressal-committee"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  Grievance Redressal Committee
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
                  href="/sc-st-cell"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  SC/ST Cell
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
                  href="/enquire-now"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/gallery"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="/scholarships"
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  Scholarships
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
            <ul className="flex gap-4 mt-6 text-xl">
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-3 text-white/80 transition-colors duration-200 hover:text-white"
                >
                  <PiInstagramLogoFill
                    className="shrink-0 text-accent-300"
                    aria-hidden="true"
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-3 text-white/80 transition-colors duration-200 hover:text-white"
                >
                  <FaYoutube
                    className="shrink-0 text-accent-300"
                    aria-hidden="true"
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-3 text-white/80 transition-colors duration-200 hover:text-white"
                >
                  <FaFacebook
                    className="shrink-0 text-accent-300"
                    aria-hidden="true"
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-3 text-white/80 transition-colors duration-200 hover:text-white"
                >
                  <FaLinkedin
                    className="shrink-0 text-accent-300"
                    aria-hidden="true"
                  />
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="flex items-center gap-3 text-white/80 transition-colors duration-200 hover:text-white"
                >
                  <FaXTwitter
                    className="shrink-0 text-accent-300"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Copyright */}
      <div className="relative z-10 border-t border-white/15">
        <Container className="py-5 text-white">
          <div className="text-center text-sm text-white/70 sm:flex-row items-center">
            <p>&copy; {new Date().getFullYear()} STCET. All rights reserved.</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
