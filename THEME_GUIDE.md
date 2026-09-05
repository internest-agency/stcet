# Global Theme Documentation

This document explains how to use the global colors and typography system set up in your project.

## Quick Start

### Using Colors in Tailwind Classes

```tsx
// Background colors
<div className="bg-primary-500">Primary Background</div>
<div className="bg-gray-100">Light Gray Background</div>
<div className="bg-success-500">Success Background</div>

// Text colors
<p className="text-primary-600">Primary Text</p>
<p className="text-error-500">Error Text</p>

// Border colors
<div className="border border-gray-300">Bordered div</div>
```

### Using Font Sizes

```tsx
// Headings
<h1 className="text-[2.25rem]">Heading 1</h1>
<h2 className="text-[1.875rem]">Heading 2</h2>
<h3 className="text-[1.5rem]">Heading 3</h3>

// Body text
<p className="text-[1rem]">Normal body text</p>
<p className="text-[0.875rem]">Small text</p>

// Display text
<div className="text-[3.75rem]">Large Display Text</div>
```

### Using Helper Functions

```tsx
import {
  createHeadingClass,
  createBodyClass,
  getTextColorClass,
  getBgColorClass
} from '@/src/lib/theme-utils';

// Create a heading with automatic sizing and color
<h1 className={createHeadingClass('h1', 'primary', 600)}>
  Welcome
</h1>

// Create body text with styling
<p className={createBodyClass('body_base', 'gray', 700)}>
  This is body text with predefined styling
</p>

// Individual utilities
<button className={`${getBgColorClass('primary', 500)} ${getTextColorClass('white')}`}>
  Click me
</button>
```

## Color Palette

### Available Color Families

1. **Primary** - Main brand color (blues)
2. **Secondary** - Secondary brand color (purples)
3. **Gray** - Neutral colors for text and backgrounds
4. **Success** - For successful states (green)
5. **Warning** - For warning states (amber)
6. **Error** - For error states (red)
7. **Info** - For informational content (cyan)

### Color Shades

Each color family has 10 shades (50, 100, 200, 300, 400, 500, 600, 700, 800, 900)

- **50-300**: Light shades (good for backgrounds and hover states)
- **400-500**: Medium shades (good for primary text and elements)
- **600-900**: Dark shades (good for dark text and hover states)

### Examples

```tsx
// Light backgrounds
<div className="bg-primary-50">Light background</div>
<div className="bg-success-100">Light success background</div>

// Medium usage
<div className="bg-primary-500 text-white">Primary button</div>

// Dark text
<p className="text-gray-900">Dark text</p>
<p className="text-error-700">Dark error text</p>
```

## Typography System

### Heading Sizes

| Class | Size            | CSS Variable        |
| ----- | --------------- | ------------------- |
| h1    | 2.25rem (36px)  | var(--font-size-h1) |
| h2    | 1.875rem (30px) | var(--font-size-h2) |
| h3    | 1.5rem (24px)   | var(--font-size-h3) |
| h4    | 1.25rem (20px)  | var(--font-size-h4) |
| h5    | 1.125rem (18px) | var(--font-size-h5) |
| h6    | 1rem (16px)     | var(--font-size-h6) |

### Body Text Sizes

| Class     | Size            | CSS Variable               |
| --------- | --------------- | -------------------------- |
| body_lg   | 1.125rem (18px) | var(--font-size-body-lg)   |
| body_base | 1rem (16px)     | var(--font-size-body-base) |
| body_sm   | 0.875rem (14px) | var(--font-size-body-sm)   |
| body_xs   | 0.75rem (12px)  | var(--font-size-body-xs)   |

### Display Sizes (for extra large text)

| Class      | Size           | CSS Variable                |
| ---------- | -------------- | --------------------------- |
| display_lg | 3.75rem (60px) | var(--font-size-display-lg) |
| display_md | 3rem (48px)    | var(--font-size-display-md) |
| display_sm | 2.25rem (36px) | var(--font-size-display-sm) |

### Font Families

- **Headings (h1-h6)**: Josefin Sans (already applied in globals.css)
- **Body text**: Nunito Sans (already applied in globals.css)

## CSS Custom Properties

All theme values are available as CSS custom properties for use in CSS/SCSS:

```css
/* Colors */
background-color: var(--primary-500);
color: var(--gray-700);
border-color: var(--success-300);

/* Font Sizes */
font-size: var(--font-size-h1);
font-size: var(--font-size-body-base);

/* Line Heights */
line-height: var(--line-height-normal);

/* Spacing */
padding: var(--spacing-md);
margin: var(--spacing-lg);
```

## Theme Files Location

- **Config**: `src/config/theme.ts` - Main theme configuration
- **CSS Variables**: `src/app/globals.css` - CSS custom properties
- **Utilities**: `src/lib/theme-utils.ts` - Helper functions

## How to Customize

To change colors or typography, edit `src/config/theme.ts` and then update the corresponding CSS variables in `src/app/globals.css`.

### Example: Change Primary Color

1. Edit `src/config/theme.ts`:

```ts
colors: {
  primary: {
    500: "#NEW_COLOR", // Change this
    // ... rest of shades
  }
}
```

2. Update `src/app/globals.css`:

```css
:root {
  --primary-500: #NEW_COLOR;
  // ... rest
}
```

## Complete Example Component

```tsx
import { createHeadingClass, createBodyClass } from "@/src/lib/theme-utils";

export function ExampleCard() {
  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      {/* Heading with primary color */}
      <h2 className={createHeadingClass("h2", "primary", 600)}>Card Title</h2>

      {/* Body text with gray color */}
      <p className={createBodyClass("body_base", "gray", 700)}>
        This is descriptive text below the heading.
      </p>

      {/* Success state */}
      <p className="text-success-600 font-semibold mt-4">✓ Status: Active</p>

      {/* Button with theme colors */}
      <button className="mt-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
        Learn More
      </button>
    </div>
  );
}
```

## Spacing Scale

Available spacing values (xs, sm, md, lg, xl, 2xl):

```tsx
<div className="p-md">// padding: 1.5rem
<div className="m-lg">// margin: 2rem
<div className="px-sm">// padding-x: 1rem
```

## Best Practices

1. **Use semantic colors**: Use `primary` for main actions, `error` for errors, `success` for confirmations
2. **Maintain hierarchy**: Use larger font sizes for more important content
3. **Consistent spacing**: Use the spacing scale rather than arbitrary values
4. **Color contrast**: When combining colors, ensure sufficient contrast for accessibility
5. **Responsive**: Combine with Tailwind's responsive prefixes (sm:, md:, lg:, etc.)

```tsx
// Good - responsive typography
<h1 className="text-[1.5rem] md:text-[2.25rem]">
  Responsive Heading
</h1>

// Good - semantic colors
<div className="bg-error-50 text-error-600 border border-error-200 p-md rounded">
  Error message
</div>
```
