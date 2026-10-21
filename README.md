# softfreshflower isb

Fresh flowers, delivered across Islamabad.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint

## Stack

Next.js 16 (App Router) with React 19, TypeScript and Tailwind CSS v4.
Space Grotesk is loaded through `next/font` and exposed as `--font-space-grotesk`.

## Notes

- The theme is intentionally light-only. `app/globals.css` pins the `dark:`
  variant to a `.dark` class that is never applied, so the OS dark-mode setting
  cannot flip the site.
- If `npm install` skips devDependencies (no TypeScript, ESLint or Tailwind in
  `node_modules`), the shell has `NODE_ENV=production` set — rerun with
  `npm install --include=dev`.
