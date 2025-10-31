# AlignUI Implementation Guide

This document provides a step-by-step guide for integrating the AlignUI design system into an existing project. The primary goal is to update the user interface without breaking the application's functionality.

## 1. Pre-computation Checklist

Before making any changes, it's crucial to prepare and understand the existing project.

- [ ] **Understand the Codebase:** Familiarize yourself with the project's structure, especially the CSS architecture, component library, and any existing styling conventions.
- [ ] **Backup the Project:** Create a complete backup or ensure you are using a version control system like Git to easily revert any changes if needed.
- [ ] **Identify Key UI Components:** List all the major UI components that will be updated (e.g., buttons, forms, navigation, typography).

## 2. AlignUI Design System Principles

This section summarizes the core principles of the AlignUI design system.

### Typography

The AlignUI typography system uses the "Inter" font family. It is based on a clear hierarchy of styles.

| Style         | Weight | Size (px) | Line Height (px) | Letter Spacing (%) |
|---------------|--------|-----------|------------------|--------------------|
| **Titles**    |        |           |                  |                    |
| H1            | 500    | 56        | 64               | -1.5               |
| H2            | 500    | 48        | 56               | -1.5               |
| H3            | 500    | 40        | 48               | -1.5               |
| H4            | 500    | 32        | 40               | 0                  |
| H5            | 500    | 24        | 32               | 0                  |
| H6            | 500    | 20        | 28               | 0                  |
| **Labels**    |        |           |                  |                    |
| X-Large       | 500    | 18        | 24               | 0                  |
| Large         | 500    | 16        | 20               | 0                  |
| Medium        | 500    | 14        | 16               | 0                  |
| Small         | 500    | 12        | 16               | 2                  |
| X-Small       | 500    | 12        | 16               | 6                  |
| **Paragraphs**|        |           |                  |                    |
| X-Large       | 400    | 18        | 28               | 0                  |
| Large         | 400    | 16        | 24               | 0                  |
| Medium        | 400    | 14        | 20               | 0                  |
| Small         | 400    | 12        | 16               | 0                  |
| X-Small       | 400    | 12        | 16               | 0                  |
| **Subheadings**|       |           |                  |                    |
| Medium        | 500    | 13        | 16               | 4                  |
| Small         | 500    | 12        | 16               | 5                  |
| 2X-Small      | 500    | 11        | 12               | 5                  |

### Color Palette

**TODO:** Please fill in this section with the color palette information from the AlignUI documentation. I was unable to access the URL you provided earlier.

- **Primary Colors:**
- **Secondary Colors:**
- **Accent Colors:**
- **Neutral Colors:**
- **System Colors (for errors, warnings, success):**

## 3. Implementation Strategy

Follow an incremental approach to apply the new design system.

1.  **Global Styles:**
    *   Start by defining the AlignUI typography and color variables in your project's global stylesheet.
    *   Apply the base font styles to the `body` element.

2.  **Component-by-Component Update:**
    *   Choose a small, low-risk component to start with (e.g., a button or a label).
    *   Create a new CSS class or update the existing one to apply the AlignUI styles.
    *   **Important:** Avoid making sweeping changes across the entire application at once.

3.  **Iterate and Test:**
    *   After updating a component, thoroughly test its appearance and functionality.
    *   Once you are confident that the component is working correctly, move on to the next one.

## 4. Testing and Verification

- **Visual Testing:** Compare the updated components with the AlignUI documentation to ensure they match the design system.
- **Functional Testing:** Click through the application and interact with the updated components to ensure they still work as expected. Check for any layout issues or broken functionality.
- **Cross-Browser Testing:** Test the changes in all supported browsers to ensure consistency.

## 5. Post-computation Review

After all components have been updated, perform a final review of the entire application to ensure a consistent and polished user experience.

# Answer

You're asking about installing the AlignUI design system into an existing project using the `@alignui/cli` tool.<cite />

## Installation Steps

To install AlignUI into your existing project, you need to run the following command from your project directory: [1](#0-0) 

```bash
npx @alignui/cli tailwind
```

## Prerequisites

Before running the installation command, ensure your project meets these requirements: [2](#0-1) 

1. **Tailwind CSS must be installed** - The CLI requires an existing Tailwind CSS setup [3](#0-2) 
2. **A CSS file with Tailwind directives** - Specifically, a CSS file containing `@tailwind base` must exist in your project [4](#0-3) 
3. **A `tailwind.config` file** - Either `tailwind.config.js` or `tailwind.config.ts` must be present [5](#0-4) 

## What the CLI Does

When you run the command, the CLI will: [6](#0-5) 

1. **Detect TypeScript usage** - Automatically determines if your project uses TypeScript [7](#0-6) 
2. **Install necessary packages** - Adds required dependencies like `tailwindcss-animate` [8](#0-7) 
3. **Prompt for preferences** - Asks you to choose:
   - Primary color (default: blue) [9](#0-8) 
   - Neutral color (default: gray) [10](#0-9) 
   - Color format (hex, rgb, or hsl) [11](#0-10) 
   - Optional class prefix [12](#0-11) 
4. **Generate configuration files** - Creates/overwrites your `tailwind.config` and CSS files with AlignUI design tokens [13](#0-12) 

## Important Warning

⚠️ **This command will overwrite your existing CSS and `tailwind.config` files** [14](#0-13)  - Make sure to commit your changes or back up these files before running the installation.

# Notes

The CLI follows a structured execution flow: it validates prerequisites via `preFlight()`, detects project configuration with `getProjectConfig()`, collects user preferences through interactive prompts, and then generates the necessary files using design tokens from the AlignUI system. [15](#0-14)  The generated files include a customized Tailwind configuration with AlignUI's color palettes, typography, shadows, and animations, plus a globals.css file with CSS variable definitions. [16](#0-15) 

Wiki pages you might want to explore:
- [Overview (alignui/cli)](/wiki/alignui/cli#1)
- [Architecture (alignui/cli)](/wiki/alignui/cli#2)

### Citations

**File:** README.md (L19-20)
```markdown
> [!CAUTION]
> This will overwrite your CSS and `tailwind.config` files.
```

**File:** README.md (L22-24)
```markdown
```bash
npx @alignui/cli tailwind
```
```

**File:** README.md (L26-26)
```markdown
This command will detect if you're using TypeScript, install the necessary packages, ask for your preferred primary color and color format, and prompt you to choose a prefix for AlignUI's classes if you’d like.
```

**File:** README.md (L28-29)
```markdown
> [!NOTE]  
> A CSS file with Tailwind directives and a `tailwind.config` file must exist in your project.
```

**File:** src/utils/get-project-info.ts (L28-28)
```typescript
      primaryColor: 'blue',
```

**File:** src/utils/get-project-info.ts (L29-29)
```typescript
      neutralColor: 'gray',
```

**File:** src/utils/get-project-info.ts (L30-30)
```typescript
      colorFormat: 'hex',
```

**File:** src/utils/get-project-info.ts (L32-32)
```typescript
      prefix: '',
```

**File:** src/utils/get-project-info.ts (L50-56)
```typescript
  for (const file of files) {
    const contents = await fs.readFile(path.resolve(cwd, file), 'utf8');
    // Assume that if the file contains `@tailwind base` it's the main css file.
    if (contents.includes('@tailwind base')) {
      return file;
    }
  }
```

**File:** src/utils/get-project-info.ts (L61-64)
```typescript
export async function isTypeScriptProject(cwd: string) {
  // Check if cwd has a tsconfig.json file.
  return pathExists(path.resolve(cwd, 'tsconfig.json'));
}
```

**File:** src/utils/get-project-info.ts (L66-78)
```typescript
export async function preFlight(cwd: string) {
  // We need Tailwind CSS to be configured.
  const tailwindConfig = await fg.glob('tailwind.config.*', {
    cwd,
    deep: 3,
    ignore: PROJECT_SHARED_IGNORE,
  });

  if (!tailwindConfig.length) {
    throw new Error(
      'Tailwind config file not found. Create a "tailwind.config.{js,ts}" file to get started.',
    );
  }
```

**File:** src/commands/tailwind.ts (L31-31)
```typescript
const PROJECT_DEV_DEPENDENCIES = ['tailwindcss-animate'];
```

**File:** src/commands/tailwind.ts (L45-69)
```typescript
  .action(async (opts) => {
    try {
      intro('AlignUI Tailwind Setup');

      const options = tailwindInitOptionsSchema.parse(opts);
      const cwd = path.resolve(options.cwd);

      if (!existsSync(cwd)) {
        console.error(`The path ${cwd} does not exist. Please try again.`);
        process.exit(1);
      }

      preFlight(cwd);
      const projectConfig = await getProjectConfig(cwd);

      if (projectConfig) {
        const config = await promptForConfig(cwd, projectConfig);
        await runInit(cwd, config);
      }

      outro('Project initialization completed!');
    } catch (error) {
      console.log(error);
    }
  });
```

**File:** src/commands/tailwind.ts (L186-199)
```typescript
    await fs.writeFile(
      config.resolvedPaths.tailwindConfig,
      await prettierFormat(
        template(tailwindConfigTemplate)({
          prefix: config.tailwind.prefix,
          colors: JSON.stringify(tailwindColorsInSelectedFormat, null, 2),
          borderRadii: JSON.stringify(borderRadii, null, 2),
          texts: JSON.stringify(textValues, null, 2),
          shadows: JSON.stringify(shadowValues, null, 2),
          animations: JSON.stringify(animations, null, 2),
        }),
      ),
      'utf8',
    );
```

**File:** src/commands/tailwind.ts (L218-226)
```typescript
    await fs.writeFile(
      config.resolvedPaths.tailwindCss,
      template(templates.GLOBALS_CSS)({
        primaryColor: config.tailwind.primaryColor,
        neutralColor: config.tailwind.neutralColor,
        ...colorVariables,
      }),
      'utf8',
    );
```
# AlignUI — Color Palette (extracted from [https://www.alignui.com/docs/v1.2/foundation/color](https://www.alignui.com/docs/v1.2/foundation/color))

> NOTE: This file is a careful extraction of the Color -> Foundation page tokens and structure. The documentation page lists color *tokens* and variable names (e.g. `--gray-50`, `--primary-base`) but does not embed the raw hex/RGB values for most tokens; those live in the system's CSS/variables or Figma file. Where hex values were present on the page (branding/social tokens) they are included.

---

## Overview

AlignUI exposes a full color system organized as:

* **Neutral / Gray families** (multi-stop scales and alpha overlays)
* **Hue families**: slate, blue, orange, red, green, yellow, purple, sky, pink, teal
* **Alpha / overlay tokens** for several palettes (e.g. `-alpha-24`, `-alpha-16`, `-alpha-10`)
* **Semantic tokens** (primary, information, warning, error, success, away, feature, verified, highlighted, stable)
* **Utility tokens**: `text-*`, `bg-*`, `stroke-*`, `static-*`, `neutral-*`
* **Social / branded tokens** (Apple, Twitter, GitHub, Notion, Tidal, Amazon, Zendesk)

---

## How this doc is organized

For each palette / group I list the token names exactly as shown on the docs page. If the docs page included a literal color value for a token I list it; otherwise I list the CSS custom property name (the `--` variable) so you can look it up in the codebase or Figma file.

---

## Neutral / Gray system

* gray-0 — `var(--gray-0)`
* gray-50 — `var(--gray-50)`
* gray-100 — `var(--gray-100)`
* gray-200 — `var(--gray-200)`
* gray-300 — `var(--gray-300)`
* gray-400 — `var(--gray-400)`
* gray-500 — `var(--gray-500)`
* gray-600 — `var(--gray-600)`
* gray-700 — `var(--gray-700)`
* gray-800 — `var(--gray-800)`
* gray-900 — `var(--gray-900)`
* gray-950 — `var(--gray-950)`

**Gray alpha overlays**

* gray-alpha-24 — `var(--gray-alpha-24)`
* gray-alpha-16 — `var(--gray-alpha-16)`
* gray-alpha-10 — `var(--gray-alpha-10)`

---

## Slate

* slate-0 — `var(--slate-0)`
* slate-50 — `var(--slate-50)`
* slate-100 — `var(--slate-100)`
* slate-200 — `var(--slate-200)`
* slate-300 — `var(--slate-300)`
* slate-400 — `var(--slate-400)`
* slate-500 — `var(--slate-500)`
* slate-600 — `var(--slate-600)`
* slate-700 — `var(--slate-700)`
* slate-800 — `var(--slate-800)`
* slate-900 — `var(--slate-900)`
* slate-950 — `var(--slate-950)`

**Slate alpha**

* slate-alpha-24 — `var(--slate-alpha-24)`
* slate-alpha-16 — `var(--slate-alpha-16)`
* slate-alpha-10 — `var(--slate-alpha-10)`

---

## Blue

* blue-50 — `var(--blue-50)`
* blue-100 — `var(--blue-100)`
* blue-200 — `var(--blue-200)`
* blue-300 — `var(--blue-300)`
* blue-400 — `var(--blue-400)`
* blue-500 — `var(--blue-500)`
* blue-600 — `var(--blue-600)`
* blue-700 — `var(--blue-700)`
* blue-800 — `var(--blue-800)`
* blue-900 — `var(--blue-900)`
* blue-950 — `var(--blue-950)`

**Blue alpha**

* blue-alpha-24 — `var(--blue-alpha-24)`
* blue-alpha-16 — `var(--blue-alpha-16)`
* blue-alpha-10 — `var(--blue-alpha-10)`

---

## Orange

* orange-50 — `var(--orange-50)`
* orange-100 — `var(--orange-100)`
* orange-200 — `var(--orange-200)`
* orange-300 — `var(--orange-300)`
* orange-400 — `var(--orange-400)`
* orange-500 — `var(--orange-500)`
* orange-600 — `var(--orange-600)`
* orange-700 — `var(--orange-700)`
* orange-800 — `var(--orange-800)`
* orange-900 — `var(--orange-900)`
* orange-950 — `var(--orange-950)`

**Orange alpha**

* orange-alpha-24 — `var(--orange-alpha-24)`
* orange-alpha-16 — `var(--orange-alpha-16)`
* orange-alpha-10 — `var(--orange-alpha-10)`

---

## Red

* red-50 — `var(--red-50)`
* red-100 — `var(--red-100)`
* red-200 — `var(--red-200)`
* red-300 — `var(--red-300)`
* red-400 — `var(--red-400)`
* red-500 — `var(--red-500)`
* red-600 — `var(--red-600)`
* red-700 — `var(--red-700)`
* red-800 — `var(--red-800)`
* red-900 — `var(--red-900)`
* red-950 — `var(--red-950)`

**Red alpha**

* red-alpha-24 — `var(--red-alpha-24)`
* red-alpha-16 — `var(--red-alpha-16)`
* red-alpha-10 — `var(--red-alpha-10)`

---

## Green

* green-50 — `var(--green-50)`
* green-100 — `var(--green-100)`
* green-200 — `var(--green-200)`
* green-300 — `var(--green-300)`
* green-400 — `var(--green-400)`
* green-500 — `var(--green-500)`
* green-600 — `var(--green-600)`
* green-700 — `var(--green-700)`
* green-800 — `var(--green-800)`
* green-900 — `var(--green-900)`
* green-950 — `var(--green-950)`

**Green alpha**

* green-alpha-24 — `var(--green-alpha-24)`
* green-alpha-16 — `var(--green-alpha-16)`
* green-alpha-10 — `var(--green-alpha-10)`

---

## Yellow

* yellow-50 — `var(--yellow-50)`
* yellow-100 — `var(--yellow-100)`
* yellow-200 — `var(--yellow-200)`
* yellow-300 — `var(--yellow-300)`
* yellow-400 — `var(--yellow-400)`
* yellow-500 — `var(--yellow-500)`
* yellow-600 — `var(--yellow-600)`
* yellow-700 — `var(--yellow-700)`
* yellow-800 — `var(--yellow-800)`
* yellow-900 — `var(--yellow-900)`
* yellow-950 — `var(--yellow-950)`

**Yellow alpha**

* yellow-alpha-24 — `var(--yellow-alpha-24)`
* yellow-alpha-16 — `var(--yellow-alpha-16)`
* yellow-alpha-10 — `var(--yellow-alpha-10)`

---

## Purple

* purple-50 — `var(--purple-50)`
* purple-100 — `var(--purple-100)`
* purple-200 — `var(--purple-200)`
* purple-300 — `var(--purple-300)`
* purple-400 — `var(--purple-400)`
* purple-500 — `var(--purple-500)`
* purple-600 — `var(--purple-600)`
* purple-700 — `var(--purple-700)`
* purple-800 — `var(--purple-800)`
* purple-900 — `var(--purple-900)`
* purple-950 — `var(--purple-950)`

**Purple alpha**

* purple-alpha-24 — `var(--purple-alpha-24)`
* purple-alpha-16 — `var(--purple-alpha-16)`
* purple-alpha-10 — `var(--purple-alpha-10)`

---

## Sky

* sky-50 — `var(--sky-50)`
* sky-100 — `var(--sky-100)`
* sky-200 — `var(--sky-200)`
* sky-300 — `var(--sky-300)`
* sky-400 — `var(--sky-400)`
* sky-500 — `var(--sky-500)`
* sky-600 — `var(--sky-600)`
* sky-700 — `var(--sky-700)`
* sky-800 — `var(--sky-800)`
* sky-900 — `var(--sky-900)`
* sky-950 — `var(--sky-950)`

**Sky alpha**

* sky-alpha-24 — `var(--sky-alpha-24)`
* sky-alpha-16 — `var(--sky-alpha-16)`
* sky-alpha-10 — `var(--sky-alpha-10)`

---

## Pink

* pink-50 — `var(--pink-50)`
* pink-100 — `var(--pink-100)`
* pink-200 — `var(--pink-200)`
* pink-300 — `var(--pink-300)`
* pink-400 — `var(--pink-400)`
* pink-500 — `var(--pink-500)`
* pink-600 — `var(--pink-600)`
* pink-700 — `var(--pink-700)`
* pink-800 — `var(--pink-800)`
* pink-900 — `var(--pink-900)`
* pink-950 — `var(--pink-950)`

**Pink alpha**

* pink-alpha-24 — `var(--pink-alpha-24)`
* pink-alpha-16 — `var(--pink-alpha-16)`
* pink-alpha-10 — `var(--pink-alpha-10)`

---

## Teal

* teal-50 — `var(--teal-50)`
* teal-100 — `var(--teal-100)`
* teal-200 — `var(--teal-200)`
* teal-300 — `var(--teal-300)`
* teal-400 — `var(--teal-400)`
* teal-500 — `var(--teal-500)`
* teal-600 — `var(--teal-600)`
* teal-700 — `var(--teal-700)`
* teal-800 — `var(--teal-800)`
* teal-900 — `var(--teal-900)`
* teal-950 — `var(--teal-950)`

**Teal alpha**

* teal-alpha-24 — `var(--teal-alpha-24)`
* teal-alpha-16 — `var(--teal-alpha-16)`
* teal-alpha-10 — `var(--teal-alpha-10)`

---

## Static tokens

* static-black — `var(--static-black)`
* static-white — `var(--static-white)`

---

## Neutral aliases / mapping (as shown on page)

* neutral-0 — `var(--neutral-0)` (alias → gray-0)
* neutral-50 — `var(--neutral-50)` (alias → gray-50)
* neutral-100 — `var(--neutral-100)` (alias → gray-100)
* neutral-200 — `var(--neutral-200)`
* neutral-300 — `var(--neutral-300)`
* neutral-400 — `var(--neutral-400)`
* neutral-500 — `var(--neutral-500)`
* neutral-600 — `var(--neutral-600)`
* neutral-700 — `var(--neutral-700)`
* neutral-800 — `var(--neutral-800)`
* neutral-900 — `var(--neutral-900)`
* neutral-950 — `var(--neutral-950)`

**Neutral alpha**

* neutral-alpha-24 — `var(--neutral-alpha-24)`
* neutral-alpha-16 — `var(--neutral-alpha-16)`
* neutral-alpha-10 — `var(--neutral-alpha-10)`

---

## Text, Background, and Stroke utility tokens (semantic aliases)

* text-strong-950 — `var(--text-strong-950)` (maps: neutral-950 / neutral-0)

* text-sub-600 — `var(--text-sub-600)` (maps: neutral-600 / neutral-400)

* text-soft-400 — `var(--text-soft-400)` (maps: neutral-400 / neutral-500)

* text-disabled-300 — `var(--text-disabled-300)` (maps: neutral-300 / neutral-600)

* text-white-0 — `var(--text-white-0)` (maps: neutral-0 / neutral-950)

* bg-strong-950 — `var(--bg-strong-950)` (maps: neutral-950 / neutral-0)

* bg-surface-800 — `var(--bg-surface-800)` (maps: neutral-800 / neutral-200)

* bg-sub-300 — `var(--bg-sub-300)` (maps: neutral-300 / neutral-600)

* bg-soft-200 — `var(--bg-soft-200)` (maps: neutral-200 / neutral-700)

* bg-weak-50 — `var(--bg-weak-50)` (maps: neutral-50 / neutral-900)

* bg-white-0 — `var(--bg-white-0)` (maps: neutral-0 / neutral-950)

* stroke-strong-950 — `var(--stroke-strong-950)`

* stroke-sub-300 — `var(--stroke-sub-300)`

* stroke-soft-200 — `var(--stroke-soft-200)`

* stroke-white-0 — `var(--stroke-white-0)`

---

## Primary (brand) tokens

* primary-dark — `var(--primary-dark)` → blue-800
* primary-darker — `var(--primary-darker)` → blue-700
* primary-base — `var(--primary-base)` → blue-500
* primary-alpha-24 — `var(--primary-alpha-24)` → blue-alpha-24
* primary-alpha-16 — `var(--primary-alpha-16)` → blue-alpha-16
* primary-alpha-10 — `var(--primary-alpha-10)` → blue-alpha-10

---

## Semantic color groupings (aliases shown on page)

These are higher-level tokens mapped to specific palette stops (the page shows the mapping but not the hex values).

### Faded

* faded-dark — `var(--faded-dark)` (neutral-800 / neutral-300)
* faded-base — `var(--faded-base)` (neutral-500)
* faded-light — `var(--faded-light)` (neutral-200 / neutral-alpha-24)
* faded-lighter — `var(--faded-lighter)` (neutral-100 / neutral-alpha-16)

### Information

* information-dark — `var(--information-dark)` (blue-950 / blue-400)
* information-base — `var(--information-base)` (blue-500)
* information-light — `var(--information-light)` (blue-200 / blue-alpha-24)
* information-lighter — `var(--information-lighter)` (blue-50 / blue-alpha-16)

### Warning (Away)

* warning-dark — `var(--warning-dark)` (orange-950 / orange-400)
* warning-base — `var(--warning-base)` (orange-500 / orange-600)
* warning-light — `var(--warning-light)` (orange-200 / orange-alpha-24)
* warning-lighter — `var(--warning-lighter)` (orange-50 / orange-alpha-16)

### Error

* error-dark — `var(--error-dark)` (red-950 / red-400)
* error-base — `var(--error-base)` (red-500 / red-600)
* error-light — `var(--error-light)` (red-200 / red-alpha-24)
* error-lighter — `var(--error-lighter)` (red-50 / red-alpha-16)

### Success

* success-dark — `var(--success-dark)` (green-950 / green-400)
* success-base — `var(--success-base)` (green-500 / green-600)
* success-light — `var(--success-light)` (green-200 / green-alpha-24)
* success-lighter — `var(--success-lighter)` (green-50 / green-alpha-16)

### Feature / Verified / Highlighted / Stable

* feature-dark / feature-base / feature-light / feature-lighter → purple family
* verified-dark / verified-base / verified-light / verified-lighter → sky family
* highlighted-dark / highlighted-base / highlighted-light / highlighted-lighter → pink family
* stable-dark / stable-base / stable-light / stable-lighter → teal family

(Exact palette-step mappings are shown on the docs page as aliases; see page for mapping pairs.)

---

## Social / branded tokens (page included literal colors)

> The docs page included literal hex values for social tokens; those are preserved below.

* social-apple — `var(--social-apple)` — `#000` / text contrast `#fff`
* social-twitter — `var(--social-twitter)` — `#010101` / text contrast `#fff`
* social-github — `var(--social-github)` — `#24292f` / text contrast `#fff`
* social-notion — `var(--social-notion)` — `#1e2226` / text contrast `#fff`
* social-tidal — `var(--social-tidal)` — `#000` / text contrast `#fff`
* social-amazon — `var(--social-amazon)` — `#353e47` / text contrast `#fff`
* social-zendesk — `var(--social-zendesk)` — `#16140d` / text contrast `#fff`

---

## Observations & next steps (how to get exact hex values)

1. The AlignUI docs page intentionally documents *tokens* and semantic mappings rather than embedding raw hex values for every token. Hex values are defined in the design system's variables/CSS or in the Figma file (which the docs reference). To extract literal hex (or HSL/OKLCH) values you can:

   * Inspect the site's loaded CSS variables at runtime (open site, use DevTools `getComputedStyle(document.documentElement).getPropertyValue('--gray-50')`).
   * Download or view the design system's variables file (often named `variables.css`, `:root` block in a global stylesheet, `tokens.css`, or a Tailwind config).
   * Open the Figma file (the docs link to a Figma library) and export color styles.

2. I did capture every token name and the semantic alias mappings from the page; those are included above so you can map token → variable → concrete color later.

---

## Small copy-paste cheatsheet (tokens only)

```
--gray-0 .. --gray-950
--slate-0 .. --slate-950
--blue-50 .. --blue-950
--orange-50 .. --orange-950
--red-50 .. --red-950
--green-50 .. --green-950
--yellow-50 .. --yellow-950
--purple-50 .. --purple-950
--sky-50 .. --sky-950
--pink-50 .. --pink-950
--teal-50 .. --teal-950
--neutral-0 .. --neutral-950
--primary-base / --primary-dark / --primary-darker / --primary-alpha-24
--text-strong-950, --bg-surface-800, --stroke-soft-200, etc.
--social-apple, --social-twitter, --social-github, --social-notion, --social-tidal
```

---

*Generated by a documented extraction of the AlignUI Color page. If you want, I can try to fetch the actual CSS/variables file or run a small script that visits the page and prints `getComputedStyle` values to capture the exact hex/HSL values for each token — tell me which approach you prefer.*

---

##