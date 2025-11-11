# Bootstrap Internal Mechanics (v4 to v5)

## Big Picture Flow

```text
Design Tokens (SCSS variables and maps)
        |
        v
Utility and Component Mixins --> Compiled CSS bundles
        |                          |
        v                          v
JS Plugins (per component)   Data API (HTML attributes)
        |                          |
        +---------- Event System and Popper.js ----------> DOM updates
```

## CSS Engine Internals

- Token layer: Sass variables for colors, spacing, breakpoints, motion, and typography feed Sass maps such as `$theme-colors` and `$utilities`. Updating a token automatically recolors every component.
- Mixins and functions: Reusable helpers (`media-breakpoint-up`, `size`, `map-loop`) assemble responsive rules and normalize units so layout math stays consistent.
- Utility generator (Bootstrap 4.3+): A Sass map describes each utility's property, responsive scope, and class prefix. A generator iterates that map to emit classes like `.p-3`, `.d-flex`, and `.text-lg-end`.
- Component partials: Files such as `_buttons.scss` and `_forms.scss` import tokens and mixins to produce themed CSS while honoring breakpoints.
- Build pipeline: `npm run dist` runs Sass compilation, then PostCSS with Autoprefixer, then cssnano. Source maps ship for debugging custom builds.

### Token Lifecyle and Overrides

- All defaults live in `scss/_variables.scss`. When you create a custom build, you copy this file, override values, and import Bootstrap afterward so the rest of the Sass sees your tokens.
- Color maps use Sass map-merging, so you can inject new semantic colors (`$theme-colors: map-merge($theme-colors, ('brand': #5c2d91));`) without editing core files.
- Breakpoint maps (`$grid-breakpoints`) drive both the grid and responsive utilities. Changing the `md` value, for example, instantly recalculates container widths and media query thresholds.

### Utility Generation Pipeline

- The file `scss/utilities/_api.scss` stores a mega-map describing every generated utility. Each entry declares `property`, `class`, `values`, and optional `responsive`, `state`, or `rtl` overrides.
- A Sass loop (`@each $utility in map-keys($utilities)`) builds CSS by combining the class prefix with each value, ensuring consistent naming conventions (`.text-start`, `.text-md-end`).
- Developers can opt out of certain utilities by redefining `$utilities` before Bootstrap is imported, reducing bundle size when shipping design systems that provide their own helpers.

### Component Assembly

- Each component partial pulls from tokens and utilities. For example, `_buttons.scss` reads from `$btn-padding-y`, `$btn-border-radius`, and `$theme-colors` to generate `.btn`, `.btn-primary`, `.btn-outline-*`, and state styles.
- Shared mixins (`button-variant`, `alert-variant`, `form-control-focus`) keep logic centralized. Changing the focus ring once updates every component that includes the mixin.
- Many components rely on `@include media-breakpoint-up(sm)` blocks to layer responsive tweaks, so the same Sass map powering the grid controls when components switch layout.

### Build and Distribution Stages

- During local development `npm start` runs `sass --watch` plus BrowserSync, recompiling on file save and injecting CSS without a full refresh.
- The release pipeline publishes multiple artifacts: `bootstrap.css`, `bootstrap.min.css`, `bootstrap-grid`, `bootstrap-reboot`, and RTL variants. Each bundle shares the same token source but includes only the required partials.
- PostCSS applies vendor prefixes based on the Browserslist config (`> 0.5%, last 2 versions`). A separate pass with `rtlcss` generates mirrored rules for right-to-left languages in v5.

### Debugging the CSS Layer

- Source maps map compiled CSS lines back to the original Sass partial, making it easier to locate styles while inspecting in DevTools.
- The docs site visualizer uses `scss/_utilities.scss` to print tables that show the class name, responsive variants, and Sass source, so you can trace generated rules quickly.

## Bootstrap 4 JavaScript Architecture

### Plugin Pattern With jQuery

- Constructor plus jQuery bridge: Each plugin defines a class and registers `$.fn.modal`, `$.fn.dropdown`, and so on. Developers can call `$(element).modal('show')`.
- Instance storage: Bootstrap stores the plugin instance on the element via `$.data(element, 'bs.modal', instance)` to prevent duplicate wiring.
- Data API: HTML attributes such as `data-toggle="modal"` and `data-target="#example"` let Bootstrap auto-bind behaviors during the initial document ready pass.
- Event namespace: Plugins dispatch `show.bs.modal`, `shown.bs.modal`, `hide.bs.dropdown`, and similar namespaced events so consumers can hook into the lifecycle.
- Popper.js v1: Tooltip, popover, and dropdown components delegate positioning math to Popper. Bootstrap passes placement, offsets, and boundary options and listens for updates.
- Transition helper: jQuery handles CSS transitions via `emulateTransitionEnd`, forcing a reflow, applying classes, and firing callbacks when animations finish.

### Data API Internals (Bootstrap 4)

- When the document is ready, Bootstrap binds a single jQuery listener per component type (`$(document).on('click.bs.dropdown.data-api', '[data-toggle="dropdown"]', handler)`).
- When the listener fires, Bootstrap prevents default behavior when necessary, extracts the target selector using `getSelector()`, and calls the plugin on the resolved element.
- Options are read by merging defaults (`Default` object), data attributes (`$this.data()`), and explicit arguments passed to the jQuery call, giving three layers of configuration.
- Disposal relies on `.off()` and `.removeData()` to tear down listeners; `destroy()` is rarely needed because data is namespaced under `bs.*` keys.

### Event Ordering (Bootstrap 4)

1. `show.bs.carousel` fires and can be prevented with `event.preventDefault()` to block the transition.
2. Bootstrap toggles classes and begins CSS animation.
3. Once `emulateTransitionEnd` resolves, it triggers the paired completion event (`slid.bs.carousel`).
4. Any focus, backdrop, or scroll locking logic runs between these events, ensuring observers can inject custom behavior at predictable points.

### Integration With External Scripts (Bootstrap 4)

- Because plugins are jQuery methods, third-party scripts can extend them by patching `$.fn` or by listening to `bs.*` events.
- The `noConflict` helper releases the plugin name if another library (for example, Prototype) also defines `$.fn.modal`, returning control to the original library and preventing global clashes.

### Modal Lifecycle (Bootstrap 4)

1. User clicks an element with `data-toggle="modal"`. A delegated jQuery listener intercepts the click.
2. The handler resolves the `data-target` selector and either fetches or creates a `Modal` instance.
3. The constructor caches the instance, prepares the backdrop, binds keyboard handlers, and sets up focus trapping.
4. `show()` toggles `.show` classes, triggers transitions, and emits `shown.bs.modal` once the animation completes.
5. Closing emits `hide.bs.modal`, removes the backdrop, unbinds listeners, and restores focus to the previously active element.

## Bootstrap 5 JavaScript Architecture

### Key Changes After Dropping jQuery

- Vanilla JS classes: Plugins now extend `BaseComponent`. Initialization uses `Modal.getOrCreateInstance(element)` instead of `$(element).modal()`.
- Data store: A lightweight `Data` utility wraps a `Map` to associate `element -> instance` entries without jQuery.
- Event system: The `EventHandler` helper registers listeners through `addEventListener`. Custom events keep names like `show.bs.modal`, preserving compatibility while avoiding jQuery overhead.
- Data API rewrite: Delegated listeners use `EventHandler.on(document, 'click.bs.modal.data-api', selector, handler)` to mimic jQuery delegation with native events.
- Popper.js v2: Dropdowns, tooltips, and popovers still depend on Popper, but the dependency is a peer package (`@popperjs/core`) that bundlers can tree-shake.
- ES modules and UMD builds: Source files are modular (`import Collapse from './collapse.js'`). The bundle pipeline produces both ESM for bundlers and UMD for script-tag usage.
- Utility helpers: Modules such as `Manipulator`, `SelectorEngine`, and `config.js` centralize DOM class toggling, selector parsing, and default option merging.

### Module Layout (Bootstrap 5)

- Each component lives in `js/src/component-name.js`. The folder also contains `base-component.js`, `dom/`, and shared utilities.
- Bundles are produced via Rollup. A configuration file outputs `dist/js/bootstrap.js` (UMD), `dist/js/bootstrap.esm.js`, and individual component builds in `dist/js/` for granular imports.
- Tree shaking happens automatically when using ES module builds; only the components you import remain in the final bundle.

### Data Attribute Resolution (Bootstrap 5)

- `config.js` defines a `DefaultType` map (expected types) and merges user-supplied options with defaults while validating types. Incorrect attribute types raise descriptive console warnings in dev mode.
- When reading data attributes, Bootstrap now prefixes everything with `data-bs-`. `Manipulator.getDataAttribute(element, 'target')` handles kebab-to-camel conversion for you.
- Config precedence mirrors v4: defaults < data attributes < constructor options. However, everything is cached per instance to avoid repeated DOM reads.

### Event Lifecycle (Bootstrap 5)

1. `EventHandler.trigger(element, 'show.bs.modal')` creates a `CustomEvent` with `cancelable: true` so consumers can prevent the action.
2. Bootstrap checks `defaultPrevented` before executing DOM mutations.
3. For asynchronous transitions, `executeAfterTransition` wraps `requestAnimationFrame` plus duration detection, ensuring completion events fire exactly once even if the browser throttles timers.
4. Completion events are fired via the same `EventHandler.trigger`, keeping parity with the old API while using native dispatch.

### Working With Popper v2

- Popper is no longer bundled. The distribution includes a `bootstrap.bundle.js` that ships with Popper for convenience and a `bootstrap.js` without it.
- Bootstrap imports only the `createPopper` function. Positioning updates happen inside lifecycle hooks such as `_completeShow` for dropdowns or `_handlePopperPlacementChange` for tooltips.
- Developers can configure Popper options by passing a `popperConfig` function to the constructor, granting shallow access to modifiers (offsets, flip, preventOverflow).

### Focus Management and Accessibility

- `FocusTrap` watches `focusin` events to loop focus inside modals and offcanvas components. It uses `Tab` key detection and restores focus to the previously active element on close.
- Keyboard handlers are centralized in utilities (`isDisabled`, `getNextActiveElement`) to ensure consistent treatment of disabled items in dropdowns or carousels.
- ARIA attributes (for example, `aria-expanded`) are updated through the `Manipulator` helper, so maintainers do not forget to keep them in sync with visual state.

### Modal Lifecycle (Bootstrap 5)

1. A click on `data-bs-toggle="modal"` triggers a delegated listener registered by `EventHandler` on the document.
2. The handler resolves the target element and calls `Modal.getOrCreateInstance` to grab the existing instance or build a new one.
3. The constructor uses utilities to add the backdrop, lock scroll, and set up focus trap behavior.
4. `show()` applies classes, listens for transition completion via `emulateTransitionEnd`, and dispatches a native `show.bs.modal` `CustomEvent`.
5. Cleanup removes listeners, hides the backdrop helper class, and restores focus, all without jQuery involvement.

## Component Deep Dive: Collapse

### Bootstrap 4 Collapse Flow

- Trigger elements use `data-toggle="collapse"` and `data-target="#id"`. On click, Bootstrap calls `$(target).collapse('toggle')`.
- The plugin reads the target's dimension (`scrollHeight` for vertical accordions) and toggles `.collapsing`, `.collapse`, and `.in` classes while setting inline height styles to drive transitions.
- Accordion behavior is implemented by reading `data-parent` and iterating through sibling collapses, calling `hide()` on any currently expanded panels.
- Event order: `show.bs.collapse` (cancelable) → transition start → `shown.bs.collapse`.
- A throttled `transitionEnd` fallback ensures the callback fires even if the browser skips the CSS transition (for example, when reduced motion is enabled).

### Bootstrap 5 Collapse Flow

- Trigger attributes become `data-bs-toggle` and `data-bs-target`; the handler resolves `SelectorEngine.findOne` to locate the panel.
- The `Collapse` class inherits from `BaseComponent`. It computes dimension by checking if the element has the class `collapse-horizontal`; horizontal collapses use width instead of height.
- CSS classes change from `.show` to `.collapsing` and back, but Bootstrap 5 uses `this._config.toggle` to allow initialization without immediate state changes.
- Accordion groups now use `data-bs-parent`. The code stores a list of open elements and closes them via `Collapse.getInstance(node).hide()`, ensuring a single shared instance per panel.
- Events mirror v4 but rely on `EventHandler.trigger`. Because everything uses native promises, you can await `collapse._queueCallback(callback, element, true)` to run logic after transitions.

### CSS Collaboration

- Both versions depend on the CSS transition defined in `_collapse.scss`, which sets `height` or `width` transitions at `0.35s ease`. The JavaScript merely toggles classes and inline dimensions; the visual animation lives entirely in CSS.
- Reduced motion is respected through the `prefers-reduced-motion` media query in `_reboot.scss`, which zeroes out transition durations. Bootstrap's JS detects the shorter duration and completes immediately via `_queueCallback`.

## Build and Packaging Differences (v4 vs v5)

- **Bundler:** Bootstrap 4 used Rollup but shipped primarily in UMD format; ES modules were experimental. Bootstrap 5 elevated ESM to first-class status, so bundlers like Vite or Webpack can tree-shake automatically.
- **Dependencies:** v4 bundle included jQuery and Popper by default. v5 offers two builds (`bootstrap.js` without Popper, `bootstrap.bundle.js` with Popper) and expects jQuery to be provided only by the application if needed.
- **Icons:** v4 recommended Glyphicons (removed after 3.3) or third-party icon sets. v5 launched Bootstrap Icons as a separate package, aligning the JS and CSS pipeline with SVG sprite support.
- **Theming:** v4 theming required Sass recompilation. v5 layers CSS variables (`--bs-primary`, `--bs-border-radius`) on top of Sass, allowing runtime tweaks (for example, toggling dark mode via `document.documentElement.style.setProperty`).
- **RTL:** v4 relied on community forks (Bootstrap RTL). v5 integrates `rtlcss` into the build, emitting `bootstrap.rtl.css` automatically.

## Observability and Debugging Techniques

- Use `window.bootstrap` (added in v5) to access constructors from the console (`bootstrap.Modal.getInstance('#exampleModal')`). This mirrors the jQuery `$(...).data('bs.modal')` pattern.
- Enable the docs' "Show code" feature to inspect rendered markup, data attributes, and JavaScript initialization snippets side by side.
- When diagnosing event order, attach listeners with `console.time` markers. Because events are custom but native, they appear in the Performance panel timeline.
- For CSS debugging, temporarily disable minification (`npm run dist -- --style=expanded`) to read compiled output with full indentation.

## Performance Considerations

- Removing jQuery in v5 eliminates ~30 KB minified (gzipped) from the default bundle. Vanilla plugins also avoid multiple layout thrashes by batching class writes.
- Components such as ScrollSpy throttle scroll handlers using `requestAnimationFrame` in v5, reducing CPU usage compared to the v4 interval timer approach.
- Tree-shaking unused plugins (for example, excluding Carousel in single-page apps) keeps the bundle lean, which was harder when every plugin piggybacked onto the jQuery prototype.
- CSS utility generation can inflate stylesheet size. Use the `$enable-negative-margins` and `$utilities` toggles to disable categories you do not need.

## Comparing Behaviors: jQuery vs Vanilla

| Concern           | Bootstrap 4 Approach                  | Bootstrap 5 Approach                                    | Migration Tip                                                              |
| ----------------- | ------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------- |
| Initialization    | `$('.modal').modal()`                 | `Modal.getOrCreateInstance(element)` or data attributes | Import the class from `bootstrap/js/dist/modal` and call methods directly. |
| Event binding     | `$('.modal').on('show.bs.modal', fn)` | `element.addEventListener('show.bs.modal', fn)`         | Keep event names, swap to native listeners.                                |
| Data attributes   | `data-toggle`, `data-target`          | `data-bs-toggle`, `data-bs-target`                      | Update attribute names; values stay the same.                              |
| Plugin options    | Pass object to jQuery plugin          | Use constructor options or `data-bs-*` attributes       | Move options into native constructor or HTML attributes.                   |
| Popper dependency | Bundled Popper v1                     | Peer dependency `@popperjs/core`                        | Install Popper when tooltips, popovers, or dropdowns are used.             |
| No-conflict       | `$.fn.modal.noConflict()`             | Not needed                                              | Remove noConflict calls because there is no jQuery bridge.                 |

## Internal Utilities Worth Knowing (Bootstrap 5)

- `BaseComponent`: Supplies `dispose`, `getInstance`, and `getOrCreateInstance` helpers shared by every plugin.
- `Collapse`: Manages height transitions with `scrollHeight` calculations and class toggling for show and hide.
- `Tooltip`: Extends `BaseComponent`, sanitizes HTML, and defers positioning to Popper with lazy imports.
- `Sanitizer`: Whitelists allowed tags and attributes to avoid cross-site scripting in tooltip and popover content.
- `reflow`: Forces layout by reading `offsetHeight`, ensuring transitions start correctly without jQuery.

## Event and Data Flow Without jQuery

```text
data-bs-toggle="collapse"
        |
        v
EventHandler delegation on document
        |
        v
SelectorEngine.findOne() resolves target
        |
        v
Collapse.getOrCreateInstance(element)
        |
        v
Manipulator toggles classes, sets height
        |
        v
DOM updates render transition
```

## When jQuery Still Appears

- Legacy apps can keep jQuery for other scripts. Bootstrap 5 does not require it, but the two can coexist.
- Community bridges (for example `bootstrap.native` or `bs-jquery`) provide optional jQuery-style APIs, though the core team recommends native usage.
- Framework wrappers such as React-Bootstrap reimplement the JS layer using component state, relying only on Bootstrap's CSS.

## Hands-on Exploration Checklist

1. Clone the Bootstrap repository and inspect `scss/` for token, mixin, and utility maps.
2. Compare `js/src/modal.js` in the v4 branch (jQuery plugin wrapper) to the v5 branch (ES module class).
3. Run `npm run docs-serve` to watch how documentation examples initialize components via data attributes.
4. Use Chrome DevTools `monitorEvents(element, 'bs.modal')` to observe lifecycle events in real time.

## Takeaway

Bootstrap's styling engine flows from Sass tokens through mixins and generated utilities, while its JavaScript layer enhances HTML via a lightweight plugin system. Version 4 relied on jQuery for DOM manipulation, delegation, and transition timing. Version 5 rebuilt the same lifecycle with native utilities, trimming dependencies and aligning with modern bundlers, yet keeping familiar APIs (`data-bs-*` attributes and `show.bs.*` events) so upgrades stay predictable.
