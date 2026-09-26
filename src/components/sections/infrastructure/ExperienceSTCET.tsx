import Container from "@/src/components/ui/Container";
import SectionHeading from "../../ui/SectionHeading";
import Button from "../../ui/Button";

export default function ExperienceSTCET() {
  return (
    <section className="relative overflow-hidden bg-gray-200 py-14 sm:py-18 lg:py-20">
      <Container>
        <div className="relative grid items-end gap-10 lg:grid-cols-[1fr_0.65fr_0.2fr] lg:gap-16">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-400" />

              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-800/45">
                10 — Experience STCET
              </span>
            </div>

            <SectionHeading as="h2" className="text-primary-600">
              A Campus That Empowers Your Tomorrow
            </SectionHeading>
          </div>

          <div>
            <p className="text-gray-800 mb-6">
              A campus designed to give students the spaces and resources they
              need to learn, explore and grow.
            </p>
            <Button href="/enquire-now" variant="accent" size="md">
              Take a Campus Tour
            </Button>
          </div>

          <div className="hidden lg:block">
            <p className="text-right text-[9px] font-bold uppercase leading-5 tracking-[0.2em] text-gray-800/35">
              Learn
              <br />
              Explore
              <br />
              Grow
              <br />
              Belong
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
