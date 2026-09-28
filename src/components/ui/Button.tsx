import React from "react";
import Link from "next/link";
import type { LinkProps } from "next/link";

type ButtonVariant = "primary" | "secondary" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

interface LinkButtonProps
  extends
    BaseProps,
    Omit<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      "className" | "children" | "href"
    > {
  as?: "link";
  href: LinkProps["href"];
}

interface NativeButtonProps
  extends
    BaseProps,
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "className" | "children"
    > {
  as: "button";
}

type ButtonProps = LinkButtonProps | NativeButtonProps;

const Button = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  ButtonProps
>((props, ref) => {
  const {
    variant = "primary",
    size = "md",
    className = "",
    leftIcon,
    rightIcon,
    children,
  } = props;

  /*
   * Base styles
   */
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2";

  /*
   * Variant styles
   */
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-500",

    secondary:
      "bg-secondary-700 text-white hover:bg-secondary-800 focus:ring-secondary-500",

    accent:
      "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-400",
  };

  /*
   * Size styles
   */
  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-4 py-2.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  /*
   * Final classes
   */
  const classes = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  /*
   * Button content
   */
  const content = (
    <>
      {leftIcon && (
        <span aria-hidden="true" className="flex shrink-0 items-center">
          {leftIcon}
        </span>
      )}

      <span>{children}</span>

      {rightIcon && (
        <span aria-hidden="true" className="flex shrink-0 items-center">
          {rightIcon}
        </span>
      )}
    </>
  );

  /*
   * ---------------------------------------------------------
   * Native Button
   * ---------------------------------------------------------
   */
  if (props.as === "button") {
    const {
      as: _as,
      variant: _variant,
      size: _size,
      className: _className,
      children: _children,
      leftIcon: _leftIcon,
      rightIcon: _rightIcon,
      ...buttonProps
    } = props;

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...buttonProps}
      >
        {content}
      </button>
    );
  }

  /*
   * ---------------------------------------------------------
   * Link Button
   * ---------------------------------------------------------
   */
  const {
    as: _as,
    variant: _variant,
    size: _size,
    className: _className,
    children: _children,
    href,
    leftIcon: _leftIcon,
    rightIcon: _rightIcon,
    ...linkProps
  } = props;

  return (
    <Link
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      className={classes}
      {...linkProps}
    >
      {content}
    </Link>
  );
});

Button.displayName = "Button";

export default Button;
