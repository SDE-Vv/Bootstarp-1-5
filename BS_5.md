# Getting Started With Bootstrap (All Versions)

## Why Bootstrap Still Matters in 2025

Bootstrap remains the fastest way for beginners and teams to prototype responsive layouts, align on design tokens, and ship production-ready UI with minimal custom CSS. In 2025 you can still start with a single `<link>` tag or integrate the framework into modern build pipelines that use Vite, Webpack, or Parcel.

## Universal Prerequisites

- Basic HTML and CSS knowledge so class names and DOM structure make sense.
- Optional JavaScript familiarity if you plan to use interactive components like modals or accordions.
- A code editor and a browser with DevTools (Chrome, Edge, Firefox, or Safari).

## Core Ways to Use Bootstrap Today

1. **CDN (Content Delivery Network):** Quickest start. Include hosted CSS and JavaScript files via `<link>` and `<script>` tags. Perfect for prototypes, CodePen demos, or classroom exercises.
2. **Download Compiled Assets:** Grab the prebuilt CSS/JS bundle, place it in your project, and reference it locally. Works well for static sites or environments without build tooling.
3. **Package Managers (npm, yarn, pnpm):** Install with `npm install bootstrap` to pull the source Sass and ES modules. Ideal for bundlers and modern frameworks.
4. **Source Sass + Custom Build:** Clone the repo or install via npm, then import only the Sass partials or JavaScript modules you need. Lets you tree-shake unused code and apply deep theming.
5. **Design System Integration:** Treat Bootstrap as a starting design system by overriding variables, generating utility maps, and layering custom components on top.

## Quick CDN Example (Bootstrap 5)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <title>Bootstrap Starter</title>
  </head>
  <body>
    <div class="container py-5">
      <h1 class="display-4">Hello Bootstrap 5</h1>
      <button class="btn btn-primary">Action</button>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
```

## Version-Specific Getting Started Guides

### Bootstrap 1.x Setup (2011)

- **Assets:** Download the ZIP from the original GitHub releases. Bundle contains compiled `bootstrap.min.css` and `bootstrap.min.js` (requires jQuery 1.7+).
- **Usage:** Link both files and jQuery in your HTML `<head>`/`<body>`. Layout relies on `<div class="container">` with `.row` and `.span*` classes.
- **Limitations in 2025:** No official support, outdated browser targets, and a non-mobile-first grid. Use only for historical study or maintaining legacy apps.

### Bootstrap 2.x Setup (2012)

- **Assets:** Similar ZIP distribution plus optional LESS sources. Requires jQuery and the Glyphicons sprite files.
- **Usage:** Responsive utilities demand additional CSS (`bootstrap-responsive.css`). Include both CSS files for adaptive layouts.
- **Limitations:** Uses LESS, class names differ from modern versions (`.span6`, `.offset2`). Significant rework needed to match contemporary accessibility and responsive standards.

### Bootstrap 3.x Setup (2013)

- **Assets:** Available via CDN (MaxCDN legacy) or npm (`npm install bootstrap@3`). Includes compiled CSS/JS and optional Sass port.
- **Usage:** Mobile-first grid with `.col-xs-*` classes. JavaScript plugins still depend on jQuery, and glyph icons are deprecated.
- **Reasons to Avoid for New Projects:** Float-based grid requires clearfix hacks; lacks native flex utilities, CSS variables, or RTL support. Security updates stopped in 2019.

### Bootstrap 4.x Setup (2018)

- **Assets:** Install using `npm install bootstrap@4` or CDN links. Ships with Sass source, compiled CSS, and JS (jQuery + Popper.js required).
- **Usage:** Flexbox grid (`.col-6`, `.order-md-2`), robust utility classes, and improved forms. Include Popper for tooltips and dropdowns.
- **When to Choose:** Maintaining existing projects built 2018–2020 or when stuck supporting Internet Explorer 11.
- **Drawbacks in 2025:** Large bundles due to jQuery, limited CSS variable usage, no official RTL files, and fewer accessibility enhancements.

### Bootstrap 5.x Setup (2021–Present)

- **Assets:** `npm install bootstrap` (latest 5.x), CDN, or download from getbootstrap.com. No jQuery dependency; Popper is bundled in `bootstrap.bundle.js` or imported separately via `@popperjs/core`.
- **Usage:** Leverage CSS variables, `row-cols` auto layouts, expanded utilities, and modern components like offcanvas, placeholders, and floating labels. ESM modules enable bundlers to tree-shake unused components.
- **Advantages in 2025:** Evergreen browser targets, RTL builds, better accessibility defaults, and guidance for modern frameworks (React, Vue, Svelte, Angular). Active maintenance continues with quarterly releases.

## Choosing the Best Version for 2025–26

- **Recommended:** Bootstrap 5.x (latest minor release). It aligns with evergreen browsers, supports modular JavaScript imports, and uses modern CSS techniques (custom properties, flexbox, grid helpers).
- **Why Not Bootstrap 4?** Requires jQuery/Popper v1, lacks CSS variables, and is in maintenance mode only. Upgrading later will be more painful because class names differ (`data-toggle` vs `data-bs-toggle`).
- **Why Not Bootstrap 3 or Earlier?** Float grids, outdated design tokens, no official dark mode guidance, and missing accessibility fixes (ARIA attributes, focus styles). CDN endpoints may disappear, and community support is minimal.
- **Long-Term Support:** Bootstrap 5 receives ongoing bug fixes and features; documentation covers migration and customization with modern tooling, making it future-proof for the next few years.

## Migrating Legacy Projects (If Needed)

1. Audit current usage: list components, utilities, and custom overrides.
2. Jump version-by-version: 3 → 4 (replace `.panel`/`.well` with `.card`), then 4 → 5 (rename data attributes, drop jQuery).
3. Use the official migration guides and run automated class rename scripts where available.
4. Add integration tests or visual regression tests to catch styling regressions after the upgrade.

## Learning Path for Beginners in 2025

1. Start with Bootstrap 5 CDN to understand class-based styling and layout primitives.
2. Explore the grid system: practice building two-column, three-column, and responsive card layouts.
3. Introduce components: navbars, modals, forms, and toasts using data attributes and minimal JavaScript.
4. Move to a package manager setup: install via npm, import Sass, and customize variables.
5. Learn theming with CSS variables and Sass maps, then experiment with `npm run docs-serve` or a Vite starter to integrate with frameworks.

Following this path teaches modern Bootstrap features first, while older versions can be studied later for historical context.

## Bootstrap vs Other CSS Frameworks (2025–26)

| Framework             | Philosophy                                                              | Best Fits                                                                                 | Trade-offs vs Bootstrap                                                                         |
| --------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Bootstrap 5**       | Component-driven with opinionated utilities and ready-made JS plugins.  | Teams wanting quick prototypes, consistent enterprise dashboards, or documentation sites. | Larger CSS footprint than utility-first kits; visual identity can look generic without theming. |
| **Tailwind CSS**      | Utility-first classes, no built-in components.                          | Design systems needing fine-grained control and custom UI libraries.                      | Steeper learning curve for class composition; requires build step for purging unused classes.   |
| **Material UI / MUI** | React component library implementing Google Material Design.            | React apps aligning with Material spec out of the box.                                    | React-only, heavier bundle, opinionated Material aesthetic that can be hard to reskin.          |
| **Bulma**             | Pure CSS framework based on Flexbox with lightweight components.        | Developers wanting a lighter Bootstrap feel without JS dependencies.                      | No official JS layer, smaller ecosystem, fewer utilities than Bootstrap 5.                      |
| **Foundation**        | Enterprise-focused framework with Sass mixins and responsive utilities. | Complex responsive sites requiring advanced grid control and accessibility tooling.       | Slower release cadence, smaller community, less beginner-friendly documentation.                |
| **Chakra UI**         | Component library with style props for React/Next.js.                   | React teams needing accessible, themeable components with CSS-in-JS approach.             | Requires JavaScript knowledge, introduces runtime styling overhead, not framework-agnostic.     |

### When To Consider Alternatives

- Choose **Tailwind** if you prefer composing every design detail yourself and have a design system ready to guide utility usage.
- Pick **MUI or Chakra UI** for React-heavy teams that want stateful components with tight integration into component props rather than HTML classes.
- Opt for **Bulma or Foundation** when you need a CSS-only solution or legacy support aligned with existing codebases.
- Stick with **Bootstrap 5** if you value extensive documentation, hybrid CSS + JS components, and a fast on-ramp for mixed-experience teams.
