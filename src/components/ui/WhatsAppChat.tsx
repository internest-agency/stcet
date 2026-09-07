"use client";

import { IoLogoWhatsapp } from "react-icons/io";

interface WhatsAppChatProps {
  phoneNumber: string;
  message?: string;
}

export default function WhatsAppChat({
  phoneNumber,
  message = "Hello, I would like to know more about STCET.",
}: WhatsAppChatProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(
    /\D/g,
    "",
  )}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="group fixed right-5 bottom-20 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 sm:right-7 sm:bottom-24"
    >
      <IoLogoWhatsapp
        aria-hidden="true"
        className="text-[1.7rem] transition-transform duration-300 group-hover:scale-110"
      />

      {/* Tooltip */}
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 sm:block">
        Chat with us
      </span>
    </a>
  );
}
