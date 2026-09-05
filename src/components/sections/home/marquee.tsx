import Marquee from "../../ui/Marquee";
import { GiCheckMark } from "react-icons/gi";

export default function MarqueeSection() {
  return (
    <section className="bg-primary-0 dark:bg-primary-0">
      <Marquee
        className="text-xl py-4 text-center uppercase font-semibold text-gray-900"
        speed={100}
        direction="left"
        pauseOnHover={true}
      >
        <p className="px-4 flex items-center gap-2">
          <GiCheckMark className="text-accent-400 text-2xl" />
          Affiliated to Anna University
        </p>
        <p className="px-4 flex items-center gap-2">
          <GiCheckMark className="text-accent-400 text-2xl" />
          Approved by AICTE
        </p>
        <p className="px-4 flex items-center gap-2">
          <GiCheckMark className="text-accent-400 text-2xl" />
          ISO 9001:2015 Certified
        </p>
        <p className="px-4 flex items-center gap-2">
          <GiCheckMark className="text-accent-400 text-2xl" />
          Five Engineering Programmes - CSE, CSE(AI & ML) IT, ECE,EEE
        </p>
      </Marquee>
    </section>
  );
}
