# Bootstrap Ramp-Up (BS_0)

This file orients you before diving into the deeper Bootstrap notes in the rest of the series. Use it as your quick briefing on how to get set up, what to expect, and how to practice effectively.

---

## Map of the Series

| File      | Focus                                                                                        |
| --------- | -------------------------------------------------------------------------------------------- |
| `BS_1.md` | What Bootstrap is, why it matters, and how it compares to other tooling.                     |
| `BS_2.md` | History and evolution so you understand the design decisions behind each release.            |
| `...`     | Intermediate notes (`BS_3.md`–`BS_5.md`) cover grids, components, and production checklists. |
| `BS_6.md` | Capstone exercises and interview-style questions (reviewed annually).                        |

Read `BS_1.md` next if you want the conceptual overview before touching code. The mid-series files (`BS_3.md` through `BS_5.md`) go deeper into implementation details when you are ready.

---

## Prerequisites

- Comfortable with semantic HTML and modern CSS (flexbox, media queries, basic custom properties).
- Working knowledge of ES6+ JavaScript so you can wire up Bootstrap's optional behaviors.
- Ability to use a terminal and package managers (`npm`, `pnpm`, or `yarn`) when grabbing dependencies.

If any of these feel shaky, allocate a short refresher session before pushing forward.

---

## Tooling Checklist

- **Editor:** VS Code with extensions such as Live Server, IntelliSense for CSS class names, and Emmet.
- **Runtime:** Node.js LTS for package-based installs and build tooling.
- **Browsers:** At minimum Chrome or Edge for devtools; keep Firefox handy to sanity-check cross-browser behavior.
- **Optional build stack:** Vite, Parcel, or a basic webpack config if you plan to tree-shake Bootstrap modules.

---

## Building Your Sandbox

Choose one of these setups for hands-on practice:

### 1. CDN Quick Start

````html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css"
    />
    <title>Bootstrap Lab</title>
  </head>
  <body class="p-4">
    <h1 class="display-4">Bootstrap Sandbox</h1>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
````

1. **Table of Contents (Optional for short projects)**

```markdown
## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
```

1. **Installation**

```markdown
## Installation

git clone https://github.com/username/project.git
cd project
npm install
```

1. **Usage Examples**

```markdown
## Usage

npm start
```

1. **Screenshots or Demos** (optional but persuasive)

```markdown
![Screenshot](https://via.placeholder.com/400x200)
```

1. **Contributing Guidelines**

```markdown
## Contributing

Fork the repo, create a feature branch, and open a Pull Request when ready.
```

1. **License**

```markdown
## License

MIT License
```

Keep the tone friendly, link out to deeper docs, and surface build/test commands prominently so collaborators can get productive fast.

---

## Previewing Markdown in VS Code

1. Open the `.md` file in the editor.
2. Keyboard shortcuts:

- Windows / Linux: `Ctrl+Shift+V` — Open Preview
- macOS: `Cmd+Shift+V` — Open Preview
- To open preview to the side (split view):
  - Windows / Linux: `Ctrl+K` then `V`
  - macOS: `Cmd+K` then `V`

1. Command Palette:

- Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS), type "Markdown: Open Preview" or "Markdown: Open Preview to the Side", and press Enter.

1. Context menu / UI:

- Right-click the editor tab and choose "Open Preview" or "Open Preview to the Side".
- Or click the "Open Preview" icon in the editor title bar (looks like an open book).

1. Tips:

- The preview updates live as you edit.
- Install "Markdown All in One" for extra features (table of contents, shortcuts, enhanced preview).

---

## When You Get Stuck

- Inspect elements in devtools to see which Bootstrap rules apply and in what order.
- Search the official docs using the component or utility name—most answers include code snippets and accessibility notes.
- Check the release notes when behavior changes between versions; `BS_3.md` flags the biggest migration gotchas.

---

## Next Step

Head to `BS_1.md` for the conceptual foundation, then follow the sequence above or jump directly to the topic you need. Keep this primer nearby as your roadmap while you work through the rest of the material.
