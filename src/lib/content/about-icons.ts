import type { IconType } from "react-icons";
import {
  FaAward,
  FaBullseye,
  FaGraduationCap,
  FaHandshake,
  FaHeart,
  FaLightbulb,
  FaStar,
  FaUsers,
} from "react-icons/fa6";

/**
 * Icon keys stored alongside About content (mission items and trust pillars).
 * Storing a stable key instead of a component lets items be reordered without
 * losing their icon, and keeps the database free of React references.
 */
export const ABOUT_ICON_KEYS = [
  "graduation-cap",
  "lightbulb",
  "users",
  "handshake",
  "bullseye",
  "award",
  "heart",
  "star",
] as const;

export type AboutIconKey = (typeof ABOUT_ICON_KEYS)[number];

export const ABOUT_ICON_LABELS: Record<AboutIconKey, string> = {
  "graduation-cap": "Graduation cap",
  lightbulb: "Lightbulb",
  users: "Users",
  handshake: "Handshake",
  bullseye: "Bullseye",
  award: "Award",
  heart: "Heart",
  star: "Star",
};

const ICONS: Record<AboutIconKey, IconType> = {
  "graduation-cap": FaGraduationCap,
  lightbulb: FaLightbulb,
  users: FaUsers,
  handshake: FaHandshake,
  bullseye: FaBullseye,
  award: FaAward,
  heart: FaHeart,
  star: FaStar,
};

/** Resolve a stored icon key, falling back to a sensible default. */
export function resolveAboutIcon(
  key: string | null | undefined,
  fallback: IconType,
): IconType {
  if (key && key in ICONS) return ICONS[key as AboutIconKey];
  return fallback;
}
