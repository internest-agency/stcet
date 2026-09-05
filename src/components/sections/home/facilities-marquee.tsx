import Marquee from "../../ui/Marquee";
import { GiDiamonds } from "react-icons/gi";

export default function FacilitiesMarquee() {
  return (
    <section className="bg-primary-700 text-white">
      <Marquee
        className="text-xl py-4 text-center font-bold uppercase tracking-widest"
        speed={100}
        direction="left"
        pauseOnHover={true}
      >
        <p className="px-4 flex items-center gap-2">
          <GiDiamonds />
          Seperate Hostels for Boys and Girls
        </p>
        <p className="px-4 flex items-center gap-2">
          <GiDiamonds />
          Hygienic Canteen
        </p>
        <p className="px-4 flex items-center gap-2">
          <GiDiamonds />
          Convenient College Buses
        </p>
        <p className="px-4 flex items-center gap-2">
          <GiDiamonds />
          Sports & Recreation
        </p>
        <p className="px-4 flex items-center gap-2">
          <GiDiamonds />
          Activities & Clubs
        </p>
      </Marquee>
    </section>
  );
}
