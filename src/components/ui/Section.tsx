import Container from "./Container";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function Section({ children, className }: SectionProps) {
  return (
    <section className={`py-12 sm:py-16 lg:py-20 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
