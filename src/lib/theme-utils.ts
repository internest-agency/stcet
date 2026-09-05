import { theme } from "@/src/config/theme";

/**
 * Tailwind class utilities for theme colors and typography
 * Use these functions to generate Tailwind classes for theme colors and sizes
 */

/**
 * Generate Tailwind classes for a color
 * @example getBgColorClass('primary', 500) => 'bg-primary-500'
 */
export const getBgColorClass = (
  colorFamily: keyof typeof theme.colors,
  shade?: number | string,
): string => {
  if (!shade) return `bg-${colorFamily}-500`;
  return `bg-${colorFamily}-${shade}`;
};

/**
 * Generate Tailwind classes for text color
 * @example getTextColorClass('primary', 600) => 'text-primary-600'
 */
export const getTextColorClass = (
  colorFamily: keyof typeof theme.colors,
  shade?: number | string,
): string => {
  if (!shade) return `text-${colorFamily}-500`;
  return `text-${colorFamily}-${shade}`;
};

/**
 * Generate Tailwind classes for border color
 * @example getBorderColorClass('gray', 300) => 'border-gray-300'
 */
export const getBorderColorClass = (
  colorFamily: keyof typeof theme.colors,
  shade?: number | string,
): string => {
  if (!shade) return `border-${colorFamily}-500`;
  return `border-${colorFamily}-${shade}`;
};

/**
 * Get font size class
 * @example getFontSizeClass('h1') => 'text-[2.25rem]'
 */
export const getFontSizeClass = (
  size: keyof typeof theme.typography.fontSize,
): string => {
  const fontSize = theme.typography.fontSize[size];
  return `text-[${fontSize}]`;
};

/**
 * Get line height class
 * @example getLineHeightClass('normal') => 'leading-[1.5]'
 */
export const getLineHeightClass = (
  lineHeight: keyof typeof theme.typography.lineHeight,
): string => {
  const lh = theme.typography.lineHeight[lineHeight];
  return `leading-[${lh}]`;
};

/**
 * Get font weight class
 * @example getFontWeightClass('bold') => 'font-bold'
 */
export const getFontWeightClass = (
  weight: keyof typeof theme.typography.fontWeight,
): string => {
  const weights: Record<keyof typeof theme.typography.fontWeight, string> = {
    thin: "font-thin",
    extralight: "font-extralight",
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
    black: "font-black",
  };
  return weights[weight];
};

/**
 * Get spacing class
 * @example getSpacingClass('md') => 'p-6'
 */
export const getSpacingClass = (
  direction: "p" | "m" | "px" | "py" | "mx" | "my",
  size: keyof typeof theme.spacing,
): string => {
  const sizeMap: Record<string, number> = {
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    "2xl": 16,
  };
  return `${direction}-${sizeMap[size]}`;
};

/**
 * Create a heading class combination
 * @example createHeadingClass('h1', 'primary', 900) => 'text-[2.25rem] font-bold text-primary-900'
 */
export const createHeadingClass = (
  headingSize: "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
  colorFamily?: keyof typeof theme.colors,
  shade?: number | string,
): string => {
  const sizeClass = getFontSizeClass(headingSize);
  const colorClass = colorFamily
    ? getTextColorClass(colorFamily, shade || 900)
    : "text-foreground";
  return `${sizeClass} font-bold ${colorClass}`;
};

/**
 * Create a body text class combination
 * @example createBodyClass('body_base', 'gray', 700) => 'text-[1rem] font-normal text-gray-700'
 */
export const createBodyClass = (
  bodySize: "body_lg" | "body_base" | "body_sm" | "body_xs",
  colorFamily?: keyof typeof theme.colors,
  shade?: number | string,
): string => {
  const sizeClass = getFontSizeClass(bodySize);
  const colorClass = colorFamily
    ? getTextColorClass(colorFamily, shade || 500)
    : "text-foreground";
  return `${sizeClass} font-normal ${colorClass}`;
};
