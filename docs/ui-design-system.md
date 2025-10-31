# Xyn.ai UI Design System

## Typography System

### Font Family
- **Primary**: SF Pro Display (system font fallback)
- **Secondary**: SF Pro Text for body content

### Typography Scale
```css
/* Headings */
h1: 32px / 38px (-0.02em letter-spacing)
h2: 28px / 34px (-0.02em letter-spacing) 
h3: 24px / 30px (-0.01em letter-spacing)
h4: 20px / 26px (-0.01em letter-spacing)
h5: 18px / 24px (0em letter-spacing)
h6: 16px / 22px (0em letter-spacing)

/* Body Text */
body-large: 18px / 28px (0em letter-spacing)
body-medium: 16px / 24px (0em letter-spacing)
body-small: 14px / 20px (0em letter-spacing)
caption: 12px / 16px (0.01em letter-spacing)
```

## Color System

### Primary Colors
```css
--primary-50: #f0f9ff
--primary-100: #e0f2fe
--primary-500: #0ea5e9
--primary-600: #0284c7
--primary-700: #0369a1
--primary-900: #0c4a6e
```

### Semantic Colors
```css
--success: #10b981
--warning: #f59e0b
--error: #ef4444
--info: #3b82f6
```

### Neutral Colors
```css
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-300: #d1d5db
--gray-400: #9ca3af
--gray-500: #6b7280
--gray-600: #4b5563
--gray-700: #374151
--gray-800: #1f2937
--gray-900: #111827
```

## Spacing System (8px base unit)

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
```

## Component Patterns

### Cards
- Border radius: 12px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Padding: 24px
- Background: White with subtle texture

### Buttons
- Height: 48px (primary actions)
- Height: 40px (secondary actions)  
- Border radius: 8px
- Font weight: 600
- Letter spacing: -0.01em

### Form Elements
- Height: 48px
- Border radius: 8px
- Border: 1px solid gray-300
- Focus: 2px solid primary-500
- Padding: 12px 16px

## Layout Grid
- Container max-width: 1200px
- Columns: 12
- Gutter: 24px
- Margins: 24px (mobile), 48px (desktop)