# GridForge

> A visual CSS Grid builder — lay out columns, rows, and named areas, then copy the generated CSS.

**[Live demo](https://su-gridforge.vercel.app)**

GridForge makes CSS Grid tangible. Configure columns and rows with fractional (`fr`) and other units, set the gap, and paint named grid areas directly on a live preview instead of guessing at `grid-template` syntax. As you build, it generates the corresponding CSS — including `grid-template-areas` — which you can copy straight into your stylesheet.

## Features

- Visual editor for columns and rows using `fr` and fixed units
- Adjustable grid gap with instant preview
- Named grid areas assigned interactively on the layout
- Generates complete CSS, including `grid-template-areas`
- One-click copy of the generated CSS

## Stack

- React 19, built with Vite
- Frontend-only — no backend or API keys

## Running locally

```bash
npm install
npm run dev
```

No environment variables are required.

---

Part of a series of 91 small web apps. [Browse them all](https://su-slopmachine.vercel.app).
