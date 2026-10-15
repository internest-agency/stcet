import { Info, Mail, Phone } from "lucide-react";

import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";

export type AdmissionContactItem = {
  id: number;
  contactType: string | null;
  title: string;
  value: string;
};

interface AdmissionContactsProps {
  initialContacts?: AdmissionContactItem[];
}

function contactHref(value: string): string | undefined {
  if (value.includes("@")) return `mailto:${value}`;
  if (/^\+?[\d\s()-]{6,}$/.test(value)) {
    return `tel:${value.replace(/[\s()-]/g, "")}`;
  }
  return undefined;
}

export default function AdmissionContacts({
  initialContacts,
}: AdmissionContactsProps = {}) {
  if (!initialContacts || initialContacts.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden bg-gray-50 py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mb-10">
          <div className="mb-5 flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-800/50">
              Admission Helpdesk
            </span>
          </div>

          <SectionHeading as="h2">Admission Enquiries</SectionHeading>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {initialContacts.map((contact) => {
            const type = contact.contactType?.toLowerCase() ?? "";
            const Icon = type.includes("email")
              ? Mail
              : type.includes("phone") || type.includes("call")
                ? Phone
                : Info;

            const href = contactHref(contact.value);

            const body = (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary-100 bg-primary-50 text-primary-700">
                  <Icon size={19} />
                </span>

                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-600">
                    {contact.contactType || "Contact"}
                  </span>

                  <h3 className="mt-1 text-base font-bold text-primary-900">
                    {contact.title}
                  </h3>

                  <p className="mt-1 break-words text-sm text-gray-700">
                    {contact.value}
                  </p>
                </div>
              </>
            );

            const className =
              "flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md";

            return href ? (
              <a key={contact.id} href={href} className={className}>
                {body}
              </a>
            ) : (
              <div key={contact.id} className={className}>
                {body}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
