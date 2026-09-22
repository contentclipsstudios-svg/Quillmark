# Quillmark

> **Publish a professional site from Markdown in one command. Zero config. Zero dependencies. Nothing to maintain.**

Quillmark turns a folder of Markdown into a fast, polished, self-contained website — one command in, a production-ready site out. No build pipeline archaeology, no plugin hell, no framework lock-in.

![version](https://img.shields.io/badge/version-1.1.0-informational)
![dependencies](https://img.shields.io/badge/dependencies-0-success)
![license](https://img.shields.io/badge/license-MIT-green)
![build](https://img.shields.io/badge/build-passing-success)
![platform](https://img.shields.io/badge/platform-Node.js_18%2B-blue)

---

## ✨ Why Quillmark

- **Ship in minutes, not weekends.** One command in, a production-ready site out. No config files to write, no toolchain to babysit.
- **Own your content, forever.** Plain Markdown in, clean standalone HTML out. Host it anywhere. Keep it forever. Your site degrades gracefully to zero risk.
- **Look expensive by default.** Built-in premium typography, automatic dark mode, responsive layout.
- **Zero dependencies.** No `node_modules` bloat. One self-contained file. Runs on any Node.js ≥ 18.

---

## 🚀 Quick start

```bash
node quillmark.js my-notes.md -o index.html --title "My Site"
```

That's it. One file out: `index.html`, ready to deploy anywhere — GitHub Pages, Netlify, a USB stick, whatever.

### Build a whole folder

```bash
node quillmark.js ./docs
```

Every `.md` in the folder becomes a standalone `.html`, next to its source.

### CLI reference

| Command | What it does |
|---|---|
| `node quillmark.js <file.md>` | Builds `<name>.html` next to your file |
| `node quillmark.js <dir>` | Builds every `.md` in the folder |
| `-o <file>` | Output path |
| `--title <t>` | Page title (or use front-matter `title:`) |
| `--help`, `--version` | Usage and version |

---

## 📝 What your Markdown can contain

Titles, bold/italic, nested lists, code blocks, inline code, links, images, HTML entities — all safely escaped. YAML front-matter `title:` sets your page title.

```markdown
---
title: My Landing Page
---
# Hello world

This is **bold**, *italic*, `inline code`, and a [link](https://example.com).

- Nested
  - lists
- work
```

---

## 🖼️ Before / After

Drag a Markdown file in, get a clean, dark-mode-friendly, responsive page out — in one shot.

> **Tip:** Copy-paste a simple `.md` into the demo below to feel the speed.

---

## 🛡️ Quality you can trust

Every feature is covered by an automated check suite (`verify.js`): front-matter handling, HTML escaping, images, nested lists, code blocks. v1.1.0 fixed four edge-case defects found by adversarial testing.

---

## 💰 Looking expensive is now a feature

- **MIT license** — free for personal and commercial use, forever.
- **Premium templates** — unlock a gallery of professional themes so your site looks like a designer built it, in one command. *(coming soon)*
- **Hosted version** — one-click deploy with a custom domain. *(planned)*

## 🛒 Get the full experience

The free CLI is the engine. The **Quillmark premium collection** — starter templates, advanced styling, and a publishing workflow guide — is available as a one-time license.

👉 **https://contentclips.gumroad.com/l/quillmark**

---

## 📜 License

CLI: MIT (free forever). Premium templates & hosted version: one-time license via the Gumroad page above.

---

Built by [contentclips](https://contentclips.gumroad.com). Questions? Open an issue or reach out on the Gumroad page.
