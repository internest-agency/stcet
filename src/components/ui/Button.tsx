import React from "react";
import Link from "next/link";
import type { LinkProps } from "next/link";

interface ButtonProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> {
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  href: LinkProps["href"];
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className = "",
      leftIcon,
      rightIcon,
      children,
      href,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantStyles = {
      primary:
        "bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-500",

      secondary:
        "bg-secondary-700 text-white hover:bg-secondary-800 focus:ring-secondary-500",

      accent:
        "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-400",
    };

    const sizeStyles = {
      sm: "px-4 py-2.5 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const classes = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Link ref={ref} href={href} className={classes} {...props}>
        {leftIcon && <span className="flex items-center">{leftIcon}</span>}

        <span>{children}</span>

        {rightIcon && <span className="flex items-center">{rightIcon}</span>}
      </Link>
    );
  },
);

Button.displayName = "Button";

export default Button;
