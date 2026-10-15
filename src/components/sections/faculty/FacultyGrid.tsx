import Image from "next/image";
import { FiMail, FiPhone } from "react-icons/fi";
import Container from "@/src/components/ui/Container";
import type { PublicFacultyMember } from "@/src/lib/queries/faculty";
import SectionHeading from "../../ui/SectionHeading";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function FacultyGrid({
  members,
}: {
  members: PublicFacultyMember[];
}) {
  return (
    <section className="relative overflow-hidden bg-gray-50">
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="mb-10 max-w-2xl lg:mb-12">
          <SectionHeading>Meet the Faculty</SectionHeading>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Dedicated educators and researchers guiding students across the
            college.
          </p>
        </div>

        {members.length ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
            {members.map((member) => {
              const hasBothIdentifiers = Boolean(
                member.auFin && member.aicteId,
              );

              return (
                <article
                  key={member.id}
                  className="flex h-full flex-col rounded-3xl border border-primary-100 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-5"
                >
                  {/* Centered Portrait */}
                  <div className="relative mx-auto aspect-[5/6] w-32 max-w-full overflow-hidden rounded-2xl border border-primary-100 bg-primary-50 shadow-sm sm:w-44">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        sizes="(max-width: 640px) 128px, 176px"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center">
                        <span className="text-3xl font-semibold text-primary-300">
                          {initials(member.name)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Faculty Information */}
                  <div className="mt-4 flex flex-1 flex-col text-center sm:mt-5">
                    <h3 className="text-lg font-bold uppercase leading-tight tracking-tight text-primary-900 break-words sm:text-xl">
                      {member.name}
                    </h3>

                    <p className="mt-1.5 text-sm font-medium text-primary-600 break-words">
                      {member.designation}
                    </p>

                    {member.department ? (
                      <p className="mt-1 text-sm uppercase font-bold text-gray-500 break-words">
                        {member.department}
                      </p>
                    ) : null}

                    {/* Identifiers */}
                    {member.auFin || member.aicteId ? (
                      <div
                        className={`mt-4 grid grid-cols-1 gap-2 ${
                          hasBothIdentifiers ? "sm:grid-cols-2 sm:gap-3" : ""
                        }`}
                      >
                        {member.auFin ? (
                          <div className="rounded-xl border border-primary-100 bg-primary-50 px-3 py-2.5 text-center">
                            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-400">
                              AU-FIN
                            </span>
                            <span className="mt-1 block text-sm font-semibold leading-snug text-primary-900 break-words [overflow-wrap:anywhere]">
                              {member.auFin}
                            </span>
                          </div>
                        ) : null}

                        {member.aicteId ? (
                          <div className="rounded-xl border border-primary-100 bg-primary-50 px-3 py-2.5 text-center">
                            <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-400">
                              AICTE ID
                            </span>
                            <span className="mt-1 block text-sm font-semibold leading-snug text-primary-900 break-words [overflow-wrap:anywhere]">
                              {member.aicteId}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {/* Qualifications */}
                    {member.qualification || member.specialization ? (
                      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                        {member.qualification ? (
                          <span className="rounded-full border border-primary-100 bg-primary-50 px-2.5 py-0.5 text-[11px] font-medium text-primary-600">
                            {member.qualification}
                          </span>
                        ) : null}

                        {member.specialization ? (
                          <span className="rounded-full border border-accent-100 bg-accent-50 px-2.5 py-0.5 text-[11px] font-medium text-accent-700">
                            {member.specialization}
                          </span>
                        ) : null}
                      </div>
                    ) : null}

                    {/* Professional Experience */}
                    {member.experience !== null ? (
                      <p className="mt-3 text-xs leading-relaxed text-primary-400">
                        <span className="font-semibold text-primary-600">
                          {member.experience} years
                        </span>{" "}
                        professional experience
                      </p>
                    ) : null}

                    {/* Contact Details */}
                    {member.email || member.phone ? (
                      <div className="mt-auto pt-4">
                        <div className="mx-auto mb-3 h-px w-16 bg-primary-100" />

                        <div className="flex flex-col items-center gap-1.5">
                          {member.email ? (
                            <a
                              href={`mailto:${member.email}`}
                              className="inline-flex max-w-full items-center gap-2 text-xs text-accent-400 transition-colors hover:text-accent-600"
                            >
                              <FiMail
                                aria-hidden
                                className="size-3.5 shrink-0"
                              />

                              <span className="min-w-0 truncate">
                                {member.email}
                              </span>
                            </a>
                          ) : null}

                          {member.phone ? (
                            <a
                              href={`tel:${member.phone.replace(/\s+/g, "")}`}
                              className="inline-flex max-w-full items-center gap-2 text-xs text-accent-400 transition-colors hover:text-accent-600"
                            >
                              <FiPhone
                                aria-hidden
                                className="size-3.5 shrink-0"
                              />

                              <span className="min-w-0 truncate">
                                {member.phone}
                              </span>
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-gray-800">
              Faculty profiles are being prepared
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Staff profiles will appear here once they are published.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
