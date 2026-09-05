import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";

export type DropdownItem = {
  href: string;
  label: string;
};

type DropdownProps = {
  href: string;
  label: string;
  items: DropdownItem[];
  menuClassName?: string;
  triggerClassName?: string;
};

export default function Dropdown({
  href,
  label,
  items,
  menuClassName = "w-72",
  triggerClassName = "",
}: DropdownProps) {
  return (
    <div className="header-dropdown group relative py-1">
      {/* Trigger */}
      <Link
        href={href}
        className={`
          header-nav-item
          flex items-center gap-1.5
          ${triggerClassName}
        `}
      >
        <span>{label}</span>

        <IoIosArrowDown
          className="
            text-sm
            transition-transform
            duration-300
            group-hover:rotate-180
            group-focus-within:rotate-180
          "
          aria-hidden="true"
        />
      </Link>

      {/* Dropdown */}
      <div
        className={`
          invisible absolute left-0 top-full z-50 pt-3
          opacity-0 translate-y-2
          transition-all duration-300
          group-hover:visible
          group-hover:translate-y-0
          group-hover:opacity-100
          group-focus-within:visible
          group-focus-within:translate-y-0
          group-focus-within:opacity-100
          ${menuClassName}
        `}
      >
        <div
          className="
            overflow-hidden
            rounded-2xl
            border border-gray-200/80
            bg-white/95
            py-2
            shadow-[0_20px_50px_rgba(0,0,0,0.12)]
            backdrop-blur-xl
          "
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                group/item
                relative
                block
                px-5 py-3
                text-sm
                font-semibold
                leading-5
                text-gray-700
                transition-all
                duration-200
                hover:bg-primary-700
                hover:text-white
                focus:bg-primary-700
                focus:text-white
                focus:outline-none
              "
            >
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
