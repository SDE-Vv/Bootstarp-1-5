# Bootstrap 5 Grid, Rows, and Columns: The Definitive Guide

Bootstrap's grid system is a responsive layout engine built on Flexbox. With it, you divide the screen into 12 logical units per row and rearrange content across breakpoints using semantic classes. This chapter covers every core class, the CSS behind it, and practical patterns so you can architect any layout confidently.

## 1. Grid System Vocabulary

- **Container**: The outer wrapper (`.container`, `.container-fluid`, etc.) that provides padding and optional max-widths. See `BS_7.md` for the full overview.
- **Row**: A `.row` element groups columns, resets the flex context, and controls horizontal/vertical gutters.
- **Column**: Elements with `.col-*` classes define the width and behavior of content within rows.
- **Breakpoint**: Named viewport width where responsive behaviors change. Bootstrap uses `xs` (implicit), `sm`, `md`, `lg`, `xl`, `xxl`.

## 2. Core CSS (from Bootstrap 5)

Rows are flex containers with negative margins to counter container padding, while columns are flex items that default to full width and shrink proportionally.

```css
.row {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  display: flex;
  flex-wrap: wrap;
  margin-top: calc(-1 * var(--bs-gutter-y));
  margin-right: calc(-0.5 * var(--bs-gutter-x));
  margin-left: calc(-0.5 * var(--bs-gutter-x));
}

.row > * {
  flex-shrink: 0;
  width: 100%;
  max-width: 100%;
  padding-right: calc(var(--bs-gutter-x) * 0.5);
  padding-left: calc(var(--bs-gutter-x) * 0.5);
  margin-top: var(--bs-gutter-y);
}

.col {
  flex: 1 0 0%;
}

.col-auto {
  flex: 0 0 auto;
  width: auto;
}

.col-1 { flex: 0 0 auto; width: 8.333333%; }
.col-2 { flex: 0 0 auto; width: 16.666667%; }
.col-3 { flex: 0 0 auto; width: 25%; }
.col-4 { flex: 0 0 auto; width: 33.333333%; }
.col-5 { flex: 0 0 auto; width: 41.666667%; }
.col-6 { flex: 0 0 auto; width: 50%; }
.col-7 { flex: 0 0 auto; width: 58.333333%; }
.col-8 { flex: 0 0 auto; width: 66.666667%; }
.col-9 { flex: 0 0 auto; width: 75%; }
.col-10 { flex: 0 0 auto; width: 83.333333%; }
.col-11 { flex: 0 0 auto; width: 91.666667%; }
.col-12 { flex: 0 0 auto; width: 100%; }
```

Breakpoint variants (for example `.col-md-6`) wrap these rules in `@media (min-width: breakpoint) { ... }`.

## 3. The Row Element

### Responsibilities

- Establishes a flex container so columns align horizontally by default.
- Manages gutters using custom properties (`--bs-gutter-x` and `--bs-gutter-y`).
- Resets column padding so gutters do not double up when rows are nested.
- Enables wrapping to the next line when columns exceed 12 units.

### Key Row Classes

| Class | Effect |
| --- | --- |
| `.row` | Default gutters (`x = 1.5rem`, `y = 0`). |
| `.row-cols-*` | Sets a fixed number of columns per row without specifying column widths manually. |
| `.gx-*`, `.gy-*`, `.g-*` | Adjust gutter sizes (horizontal, vertical, both). |
| `.g-0` | Removes gutters entirely (careful: columns will touch). |
| `.align-items-*` | Vertical alignment of column content within the row. |
| `.justify-content-*` | Horizontal distribution of columns (useful with `.col-auto`). |

### Row Column Count Helpers (`.row-cols-*`)

Bootstrap provides `.row-cols-1` through `.row-cols-6`, plus breakpoint variants like `.row-cols-md-4`. These apply `flex: 0 0 auto; width: 100% / n;` to every direct child, independent of `.col-*` classes. They are ideal for card grids where the number of items per row changes responsively.

Example CSS:

```css
.row-cols-3 > * {
  flex: 0 0 auto;
  width: 33.333333%;
}

@media (min-width: 768px) {
  .row-cols-md-4 > * {
    flex: 0 0 auto;
    width: 25%;
  }
}
```

## 4. The Column Element

Columns are flex items inside rows. They have padding for gutters and accept many width control classes.

### Column Width Classes

- `.col`: Auto flex (equal width columns). Each `.col` shares the row width equally regardless of count.
- `.col-{1-12}`: Fixed fraction of the row, based on 12-unit grid (e.g., `.col-3` = 25%).
- `.col-{breakpoint}`: Auto width applied from the breakpoint upward (e.g., `.col-md` equals `.col` starting at `md`).
- `.col-{breakpoint}-{1-12}`: Fixed width that activates at the specified breakpoint (e.g., `.col-lg-4`).
- `.col-auto`: Sizes to intrinsic content width while preserving gutter padding.

Breakpoints follow this naming pattern:

| Shorthand | Full class example | Media query |
| --- | --- | --- |
| none (`xs`) | `.col-6` | Always (no media query). |
| `sm` | `.col-sm-6` | `@media (min-width: 576px)` |
| `md` | `.col-md-6` | `@media (min-width: 768px)` |
| `lg` | `.col-lg-6` | `@media (min-width: 992px)` |
| `xl` | `.col-xl-6` | `@media (min-width: 1200px)` |
| `xxl` | `.col-xxl-6` | `@media (min-width: 1400px)` |

### Column Ordering

Use ordering classes to rearrange the visual order of columns without changing HTML structure.

- `.order-first` / `.order-last` force items to the beginning or end of the flex order.
- `.order-0` through `.order-5` assign explicit order values.
- Breakpoint-aware variants (e.g., `.order-md-2`) only apply at specific widths.

CSS excerpt:

```css
.order-1 { order: 1; }
.order-md-2 { order: 2; }
.order-first { order: -1; }
.order-last { order: 6; }
```

### Column Offsets

Offsets create leading space before a column using margin.

- `.offset-{n}` adds left margin equal to `n` grid columns (up to 11).
- Breakpoint variants like `.offset-lg-3` apply only at the defined width.

CSS snippet:

```css
.offset-3 { margin-left: 25%; }

@media (min-width: 992px) {
  .offset-lg-2 { margin-left: 16.666667%; }
}
```

### Alignment Utilities on Columns

Since columns are flex items, you can use alignment helpers:

- `.align-self-start`, `.align-self-center`, `.align-self-end`: Vertical alignment inside the row.
- `.mt-auto`, `.mb-auto`: Auto margins for vertical distribution in stacked scenarios.

## 5. Gutters in Depth

Gutters are controlled via CSS variables and utility classes. By default, horizontal gutters are `1.5rem` (24px) and vertical gutters are `0`.

- `.g-0` removes both horizontal and vertical gutters.
- `.gx-0`, `.gx-1`, ..., `.gx-5` adjust horizontal padding.
- `.gy-0`, `.gy-1`, ..., `.gy-5` adjust vertical spacing between rows of columns.
- Values correspond to the spacing scale (0 = 0, 1 = 0.25rem, 2 = 0.5rem, 3 = 1rem, 4 = 1.5rem, 5 = 3rem).
- Gutters are computed as half the specified value on each side of a column.

Custom gutter control example:

```html
<div class="row gx-5 gy-3">
  <div class="col">A</div>
  <div class="col">B</div>
</div>
```

This sets horizontal gutter to `3rem` (`1.5rem` padding per side) and vertical gutter to `1rem`.

## 6. Practical Layout Patterns

### Equal Columns by Default

```html
<div class="row">
  <div class="col">One-third</div>
  <div class="col">One-third</div>
  <div class="col">One-third</div>
</div>
```

All columns share space equally because `.col` uses `flex: 1 0 0%`.

### Responsive Column Sizes

```html
<div class="row">
  <div class="col-12 col-md-8 col-xl-9">Main content</div>
  <div class="col-12 col-md-4 col-xl-3">Sidebar</div>
</div>
```

- Stacks vertically on phones (`col-12`).
- Splits 8/4 from `md` upward.
- Adjusts to 9/3 on large desktops.

### Auto-Width Columns With Content-Based Sizing

```html
<div class="row justify-content-between">
  <div class="col-auto">
    <h2 class="h5 mb-0">Product Name</h2>
  </div>
  <div class="col-auto">
    <span class="badge bg-success">In Stock</span>
  </div>
</div>
```

`.col-auto` shrinks to fit the content while the row spacing is handled with `justify-content-between`.

### Using `row-cols` for Card Decks

```html
<div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
  <div class="col">
    <div class="card h-100">Card 1</div>
  </div>
  <!-- Repeat cards -->
</div>
```

No manual column widths are needed; the row maintains 1, 2, or 4 cards per row depending on viewport width.

### Nested Grids

Columns can contain rows to create more complex layouts. Always wrap the nested columns in their own `.row`.

```html
<div class="row">
  <div class="col-lg-8">
    <div class="row g-2">
      <div class="col-6">Gallery item</div>
      <div class="col-6">Gallery item</div>
      <div class="col-6">Gallery item</div>
      <div class="col-6">Gallery item</div>
    </div>
  </div>
  <div class="col-lg-4">
    Sidebar content
  </div>
</div>
```

### Offsets for Centered Content

```html
<div class="row">
  <div class="col-10 col-md-6 offset-1 offset-md-3">
    <div class="p-4 bg-light border">Centered block</div>
  </div>
</div>
```

On mobile the block spans 10 units with a 1-unit offset (centers within 12). On desktop it becomes 6 units wide centered by a 3-unit offset on each side.

## 7. Advanced Techniques

### Mixing Order and Hidden Columns

Combine order utilities with display helpers for complex responsive layouts.

```html
<div class="row">
  <aside class="col-12 col-lg-3 order-lg-first order-last">
    Sidebar
  </aside>
  <main class="col-12 col-lg-9">
    Primary content
  </main>
</div>
```

The sidebar appears below the content on mobile but moves to the left on large screens.

### Equal Height Columns

Rows use flexbox, so columns in the same row naturally match height when their content allows. For card layouts, apply `h-100` to children to force equal heights.

```html
<div class="row g-4">
  <div class="col-md-4">
    <div class="card h-100">...</div>
  </div>
  <div class="col-md-4">
    <div class="card h-100">...</div>
  </div>
  <div class="col-md-4">
    <div class="card h-100">...</div>
  </div>
</div>
```

### Combining with Utility API Custom Properties

Change gutter spacings per row by overriding `--bs-gutter-x` and `--bs-gutter-y` inline or via custom classes.

```html
<div class="row" style="--bs-gutter-x: 4rem; --bs-gutter-y: 1.5rem;">
  <div class="col-6">Wide horizontal spacing</div>
  <div class="col-6">Wide horizontal spacing</div>
</div>
```

## 8. Grid Best Practices

- Always wrap `.col-*` elements directly inside `.row`. Extra wrappers break gutter alignment.
- Respect the 12-unit limit per row; when columns exceed 12 combined units they wrap automatically, which can cause unexpected stacking if not intentional.
- Use the smallest number of custom CSS overrides possible. Bootstrap's column classes cover most layout needs.
- When debugging layout issues, temporarily add `bg-light` or `border` utilities to visualize column boundaries.
- Combine spacing utilities with grid classes for vertical rhythm instead of nesting empty rows or columns.
- Check every breakpoint. The grid is responsive by design, so verify how columns stack or align at `sm`, `md`, `lg`, `xl`, and `xxl` widths.

## 9. Quick Reference Table

| Category | Classes | Purpose |
| --- | --- | --- |
| Base columns | `.col`, `.col-1` … `.col-12` | Auto or fixed width columns. |
| Responsive columns | `.col-sm-6`, `.col-md-4`, `.col-lg-auto` | Width or auto sizing applied from specific breakpoints. |
| Row column counts | `.row-cols-1`, `.row-cols-md-2` | Auto column count per row. |
| Gutters | `.g-0`, `.gx-3`, `.gy-4`, inline `style="--bs-gutter-x"` | Controls horizontal/vertical spacing between columns. |
| Offsets | `.offset-2`, `.offset-lg-1` | Adds leading space before a column. |
| Order | `.order-first`, `.order-md-2` | Reorder columns responsively. |
| Alignment | `.justify-content-between`, `.align-items-center`, `.align-self-end` | Flex alignment of columns or inner content. |

With this guide, you have every moving part of the Bootstrap 5 grid at your fingertips. Experiment with combinations in a sandbox, memorise the responsive naming scheme, and you will build complex, responsive layouts with ease.

