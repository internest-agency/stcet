"use client";

import Link from "next/link";
import { IoArrowForward } from "react-icons/io5";

interface EnquireNowProps {
  href?: string;
}

export default function EnquireNow({ href = "/enquire-now" }: EnquireNowProps) {
  return (
    <Link
      href="/enquire-now"
      aria-label="Enquire Now"
      className="fixed top-1/2 right-0 z-40 flex -translate-y-1/2 bg-accent-400 px-3 py-5 text-white shadow-lg transition-all duration-300 hover:bg-primary-700 hover:px-4"
    >
      <span
        className="text-xs font-bold uppercase tracking-[0.18em]"
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
        }}
      >
        Enquire Now
      </span>
    </Link>
  );
}
