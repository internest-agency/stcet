import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center ${className}`}>
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {/* Home */}
        <li className="flex items-center">
          <Link
            href="/"
            className="text-gray-500 transition-colors duration-200 hover:text-primary-700"
          >
            Home
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              <IoChevronForward
                className="shrink-0 text-xs text-gray-400"
                aria-hidden="true"
              />

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-500 transition-colors duration-200 hover:text-primary-700"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast ? "font-medium text-gray-900" : "text-gray-500"
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
