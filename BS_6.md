# Bootstrap Core Structure & Universal Classes

This guide covers the foundational layout and utility classes that appear across Bootstrap releases (v3 onward). Class names occasionally gain variants, but these essentials remain recognizable in any version.

## 1. Project Skeleton

Every page built with Bootstrap starts with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap Starter</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css">
  </head>
  <body>
    <!-- Your content here -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
```

- `meta viewport` ensures responsive scaling on mobile devices.
- CSS comes from either the CDN or a local `bootstrap.min.css` download.
- `bootstrap.bundle.min.js` includes Popper so dropdowns, tooltips, and popovers work without extra files.

## 2. Layout Foundations

### Containers

- `container` centers content with responsive max-widths.
- `container-fluid` spans the full viewport width.
- `container-{breakpoint}` (for example `container-lg`) behaves fluid until the named breakpoint.

### Grid Rows & Columns

- `row` wraps columns and handles negative margins that align with container padding.
- `col` auto-distributes width; `col-6` consumes half of the 12-column grid on all breakpoints.
- `col-sm-4`, `col-md-3`, etc., apply widths at specific minimum viewport sizes.
- `row-cols-*` creates evenly sized columns without custom sizing.
- `g-*`, `gx-*`, `gy-*` control gutters globally, horizontally, or vertically.

### Breakpoints (Common Names)

`xs` (implicit), `sm`, `md`, `lg`, `xl`, and `xxl` power responsive classes. Earlier versions end at `xl`, but the naming pattern is consistent.

## 3. Typography & Content Helpers

- `display-1` through `display-6` offer oversized headings.
- `lead` highlights introductory paragraphs with larger type.
- `fw-bold`, `fw-semibold`, `fw-light` change font weight.
- `text-center`, `text-start`, `text-end` align text; append breakpoints like `text-md-start` for responsive control.
- `text-muted`, `text-primary`, `text-success`, etc., apply semantic colors.
- `blockquote` and `blockquote-footer` present quotations with consistent styling.

## 4. Components With Shared Class Names

- **Buttons**: `btn`, `btn-primary`, `btn-outline-secondary`, `btn-lg`, `btn-sm` control appearance and size.
- **Alerts**: `alert`, `alert-warning`, `alert-dismissible`, plus the close button (`btn-close` or legacy `close`).
- **Badges**: `badge`, contextual background utilities such as `bg-info`, and shape helpers like `rounded-pill`.
- **Navbars**: `navbar`, `navbar-brand`, `navbar-nav`, `nav-link`, `navbar-toggler`, and `collapse` for responsive menus.
- **Cards**: `card`, `card-body`, `card-header`, `card-footer`, `card-img-top` build structured content blocks.
- **Forms**: `form-control`, `form-check`, `form-check-input`, `form-check-label`, `input-group`, `input-group-text` cover inputs and validation states.
- **Tables**: `table`, `table-striped`, `table-bordered`, `table-hover`, `table-sm` provide consistent table styling.
- **Modals**: `modal`, `modal-dialog`, `modal-content`, `modal-header`, `modal-body`, `modal-footer` deliver layered dialogs.

## 5. Utility Classes That Persist

- **Spacing**: `m-*` and `p-*` manage margin and padding. Directional suffixes (`t`, `b`, `s`, `e`, `x`, `y`) target sides, while numeric scales adjust size.
- **Flexbox**: `d-flex`, `d-inline-flex`, `flex-row`, `flex-column`, `justify-content-*`, `align-items-*`, `align-self-*` shape layout behavior.
- **Display Helpers**: `d-none`, `d-block`, `d-lg-none`, etc., toggle visibility per breakpoint.
- **Sizing**: `w-100`, `w-50`, `h-100`, `h-auto`, and ratio helpers manage element dimensions.
- **Background & Text Colors**: `bg-light`, `bg-dark`, `bg-warning`, paired with `text-dark`, `text-white`, `text-danger`.
- **Borders**: `border`, `border-0`, `border-top`, context colors like `border-primary`, plus `rounded` and `rounded-circle` for radii.
- **Position Helpers**: `position-relative`, `position-absolute`, `top-0`, `start-50`, `translate-middle` fine-tune placement.

## 6. Grid & Utility Workflow Example

```html
<div class="container py-5">
  <div class="row g-4">
    <div class="col-md-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h2 class="h5">Reusable Patterns</h2>
          <p class="text-muted mb-4">Toggle spacing, alignment, and visibility with utilities rather than custom CSS.</p>
          <a class="btn btn-primary w-100" href="#">Learn more</a>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card h-100 border border-2 border-primary">
        <div class="card-body">
          <h2 class="h5">Grid First Layouts</h2>
          <p class="mb-3">Compose layouts with <code>row</code> and <code>col</code>. Adjust column spans per breakpoint.</p>
          <span class="badge bg-success">Works everywhere</span>
        </div>
      </div>
    </div>
    <div class="col-md-4 d-flex align-items-stretch">
      <div class="card w-100">
        <div class="card-body text-center">
          <h2 class="h5">Utilities + Components</h2>
          <p class="mb-4">Mix utility classes with components to reduce custom CSS.</p>
          <button class="btn btn-outline-secondary">Try it</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

This snippet stays valid from Bootstrap 4 through the latest releases. Utility class names and grid semantics are consistent, while only spacing scales or optional extras change between versions.

## 7. Good Practices

- Keep custom CSS minimal; lean on utilities for spacing, alignment, and color.
- Always wrap columns in a `row`, and rows in a container to maintain proper gutters.
- Use responsive suffixes (`-sm`, `-md`, etc.) to progressively enhance layouts.
- Load `bootstrap.bundle.min.js` (or Popper + Bootstrap JS) whenever components rely on JavaScript.
- Cross-check the documentation for your exact version to confirm whether a class gained new options or was deprecated.

These core structures and classes form the foundation of any Bootstrap project and remain stable regardless of the specific release. Mastering them makes it easy to adapt to minor version differences.
