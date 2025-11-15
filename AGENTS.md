# Repository Guidelines

## Project Structure & Module Organization
StoryCircle runs on Vite + React + TypeScript. `src/main.tsx` mounts `App.tsx`, whose `Screen` union routes between every mobile view. UI flows live in `src/components/*Screen.tsx`, shared primitives stay under `src/components/ui`, and media helpers such as `ImageWithFallback` live in `src/components/figma`. Mock or shared logic belongs in `src/lib` (`mockData.ts` seeds the story wall). Global Tailwind output is split between `src/index.css` and `src/styles/globals.css`; keep asset credits in `src/Attributions.md` current.

## Build, Test, and Development Commands
`npm install` installs dependencies, `npm run dev` launches the hot-reload server on :5173, and `npm run build` produces the optimized bundle in `dist/`. Use `npx vite preview` after a build for a production-like smoke test.

## Coding Style & Naming Conventions
Author functional React components with explicit prop interfaces and 2-space indentation. Files for components use PascalCase, hooks use camelCase with a `use` prefix, and utilities live in `src/lib`. Co-locate handlers near related state (see `App.tsx`) and keep JSX sections focused on presentation. Tailwind utility classes and the CSS variables defined in `globals.css` are the default styling tools; extend Radix primitives inside `src/components/ui` rather than one-off overrides.

## Testing Guidelines
No automated tests exist yet, so new work should introduce Vitest + React Testing Library suites. Place specs next to the component as `ComponentName.test.tsx`, mock data through `src/lib/mockData.ts`, and verify navigation flows in `App.tsx`. Target roughly 80% coverage for any new module and document risk areas in the PR. Once Vitest is configured, run `npx vitest run --coverage` before requesting review.

## Commit & Pull Request Guidelines
History shows short, imperative subjects (`Add files from Figma Make`, `Initial commit`); continue that format and limit each commit to one logical change. PRs must explain the why and the how, link a tracking issue, confirm `npm run build` (and tests, when available), and include screenshots or clips for UI adjustments. Call out updates to mock data, Attributions, or configuration so reviewers know what to verify.

## Assets & Configuration Tips
Favor `ImageWithFallback` for remote imagery, and adjust theme tokens in `src/styles/globals.css` so colors remain consistent across screens. When adding a new Radix primitive, create or extend its wrapper once in `src/components/ui` and import it elsewhere to preserve consistent props, theming, and accessibility defaults.
