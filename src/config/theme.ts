// Global Theme Configuration
export const theme = {
  colors: {
    // Primary Colors
    primary: {
      50: "#f0f7ff",
      100: "#e0effe",
      200: "#bae0fd",
      300: "#7cc7fc",
      400: "#36aef9",
      500: "#0b93f0",
      600: "#0073cc",
      700: "#0059a6",
      800: "#004a87",
      900: "#003d6f",
    },

    // Secondary Colors
    secondary: {
      50: "#f5f3ff",
      100: "#ede9fe",
      200: "#ddd6fe",
      300: "#c4b5fd",
      400: "#a78bfa",
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
      800: "#5b21b6",
      900: "#4c1d95",
    },

    // Neutral/Gray
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },

    // Success Color
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#145231",
    },

    // Warning Color
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },

    // Error/Danger Color
    error: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
    },

    // Info Color
    info: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
    },

    // Semantic Colors
    semantic: {
      background: "var(--background)",
      foreground: "var(--foreground)",
      border: "#e5e7eb",
      borderLight: "#f3f4f6",
    },
  },

  typography: {
    fontSize: {
      // Heading Sizes
      h1: "2.25rem", // 36px
      h2: "1.875rem", // 30px
      h3: "1.5rem", // 24px
      h4: "1.25rem", // 20px
      h5: "1.125rem", // 18px
      h6: "1rem", // 16px

      // Body Sizes
      body_lg: "1.125rem", // 18px
      body_base: "1rem", // 16px
      body_sm: "0.875rem", // 14px
      body_xs: "0.75rem", // 12px

      // Display (large titles)
      display_lg: "3.75rem", // 60px
      display_md: "3rem", // 48px
      display_sm: "2.25rem", // 36px
    },

    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },

    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },

    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },

  spacing: {
    xs: "0.5rem", // 8px
    sm: "1rem", // 16px
    md: "1.5rem", // 24px
    lg: "2rem", // 32px
    xl: "3rem", // 48px
    "2xl": "4rem", // 64px
  },

  breakpoints: {
    xs: "320px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

// Helper function to access colors
export const getColor = (
  colorName: keyof typeof theme.colors,
  shade: string | number = 500,
): string => {
  const color = theme.colors[colorName];
  if (typeof color === "string") return color;
  return color[shade as keyof typeof color] || "#000000";
};

// Helper function to access font sizes
export const getFontSize = (
  size: keyof typeof theme.typography.fontSize,
): string => {
  return theme.typography.fontSize[size];
};
