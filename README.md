# Stephulz Portfolio

[![CI](https://github.com/Stephulz/stephulz-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Stephulz/stephulz-portfolio/actions/workflows/ci.yml)
[![Node](https://img.shields.io/badge/node-22-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)

Personal portfolio built with **Angular 22**, **TypeScript 6**, **SCSS**, and
**Jest**. Deployed on **Vercel**.

## Stack

| Layer | Tech |
|---|---|
| Framework | Angular 22 (standalone, SSR) |
| Language | TypeScript 6 (strict mode) |
| Styling | SCSS (component-scoped, CSS custom properties) |
| Testing | Jest + jsdom (125 tests across 10 files, **100% coverage**) |
| Linting | Angular ESLint |
| Hosting | Vercel (Hobby) |
| CI | GitHub Actions (lint, test, coverage, SAST, build) |

## Commands

```bash
# Serve locally (injects pre-boot skeleton automatically)
npm start

# Run tests (single run)
npm test

# Run tests (CI mode)
npm run test:ci

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Production build (injects pre-boot skeleton automatically)
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/           # Data interfaces & constants
│   │   └── services/         # ThemeService, TranslationService
│   └── shared/
│       ├── components/       # Header, Footer, Timeline, toggles, loading-spinner
│       └── i18n/             # English & Portuguese translations
├── index.html                # Entry point (pre-bootstrap spinner via placeholder)
├── styles.scss               # Global theme variables
├── main.ts                   # Client-side bootstrap
├── main.server.ts            # Server-side rendering entry
└── server.ts                 # Express server for SSR

public/
├── pre-boot.css              # Pre-bootstrap spinner styles├── skeleton.html              # Pre-bootstrap spinner markup (injected at build time)
└── favicon.ico

scripts/
└── inject-skeleton.mjs       # Build-time script to inline pre-boot skeleton into index.html
```

## Pre-bootstrap Loading

The app shows a loading spinner immediately on page load (before Angular boots).
The spinner markup is inlined into `index.html` at build time via
`scripts/inject-skeleton.mjs`. The styles live in `public/pre-boot.css` for a
clean separation from the application code.

Once Angular's `ThemeService` signals that the app is ready (`loaded` signal),
the spinner is faded out and removed from the DOM.

## Constitution

This project follows a formal constitution defining four core principles:
**Strict TypeScript**, **Standalone Components**, **SCSS Styling**, and
**100% Test Coverage** via TDD (Red/Green).

See [`.specify/memory/constitution.md`](.specify/memory/constitution.md).

## License

MIT
