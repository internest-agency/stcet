"use client";

import Image from "next/image";

import Container from "@/src/components/ui/Container";
import Button from "../../ui/Button";
import { FaCircleArrowRight } from "react-icons/fa6";
import SectionHeading from "../../ui/SectionHeading";

export type AdmissionRouteItem = {
  number: string;
  title: string;
  description: string;
  image: string;
  href: string;
  button: string;
};

interface AdmissionRoutesProps {
  initialRoutes?: AdmissionRouteItem[];
}

export default function AdmissionRoutes({
  initialRoutes,
}: AdmissionRoutesProps = {}) {
  const routeList = initialRoutes;

  return (
    <section className="bg-primary-800 py-14 sm:py-18 lg:py-20">
      <Container>
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-200/50">
              Admission Routes
            </span>
          </div>
          <SectionHeading as="h2" className="text-white">
            How Can You Join STCET?
          </SectionHeading>

          <p className="mt-3 text-gray-200">
            Choose the admission route that is right for you.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {routeList && routeList.length > 0
            ? routeList.map((route, index) => (
                <article
                  key={`${route.number}-${index}`}
                  className="group relative min-h-[280px] rounded-xl overflow-hidden bg-white"
                >
                  <Image
                    src={route.image}
                    alt={route.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-linear-to-r from-white via-white/90 to-transparent" />

                  <div className="relative z-10 flex min-h-[360px] max-w-[65%] flex-col items-start justify-between p-7 sm:p-9">
                    <div>
                      <span className="text-[11px] font-bold text-accent-400">
                        {route.number}
                      </span>
                      <SectionHeading as="h3" className="mt-2">
                        {route.title}
                      </SectionHeading>
                      <p className="mt-5 text-gray-800">{route.description}</p>
                    </div>

                    <Button
                      href={route.href}
                      variant="accent"
                      size="md"
                      rightIcon={<FaCircleArrowRight />}
                    >
                      {route.button}
                    </Button>
                  </div>
                </article>
              ))
            : null}
        </div>
      </Container>
    </section>
  );
}
