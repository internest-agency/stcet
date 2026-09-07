"use client";

import { useEffect, useState } from "react";
import { SlArrowUp } from "react-icons/sl";

export default function GoToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Go to top"
      title="Go to top"
      className={`group fixed right-5 bottom-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-primary-700 text-white shadow-lg transition-all duration-300 hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 sm:right-7 sm:bottom-7 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <SlArrowUp
        aria-hidden="true"
        className="text-sm transition-transform duration-300 group-hover:-translate-y-0.5"
      />
    </button>
  );
}
