# Stephulz Portfolio

[![Node](https://img.shields.io/badge/node-22-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![CI](https://github.com/Stephulz/stephulz-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Stephulz/stephulz-portfolio/actions/workflows/ci.yml)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)

Personal portfolio built with **Angular 22**, **TypeScript 6**, **SCSS**, and
**Jest**. Deployed on **Vercel**.

## Stack

| Layer | Tech |
|---|---|
| Framework | Angular 22 (standalone, SSR) |
| Language | TypeScript 6 (strict mode) |
| Styling | SCSS (component-scoped, CSS custom properties) |
| Testing | Jest + jsdom |
| Linting | Angular ESLint |
| SAST | Semgrep (cached weekly) |
| Dependency scanning | Trivy (cached weekly) |
| Hosting | Vercel (Hobby) |
| CI | GitHub Actions (lint, test, coverage, SAST, Trivy, build) |
| Feature Toggle | ConfigCat |

## Commands

```bash
# Serve locally
npm start

# Run tests (single run)
npm test

# Run tests (CI mode)
npm run test:ci

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Production build
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
├── index.html                # Entry point (pre-bootstrap spinner inlined)
├── styles.scss               # Global theme variables
├── main.ts                   # Client-side bootstrap
├── main.server.ts            # Server-side rendering entry
└── server.ts                 # Express server for SSR

public/
└── favicon.ico
```

## Pre-bootstrap Loading

The app shows a dual-ring loading spinner immediately on page load (before
Angular boots). The spinner CSS is inlined in `index.html` so no external
request is needed for the initial paint.

Once Angular's `ThemeService` signals that the app is ready (`loaded` signal),
the `fadeOutPreBootSkeleton()` function adds a `hidden` class to fade the
spinner out, then removes it from the DOM after the CSS transition completes.

## CI Pipeline

The CI workflow runs on every push/PR to `main`:

1. **Lint** — Angular ESLint
2. **Test** — Jest with 100% coverage enforcement
3. **Semgrep** — SAST scan (pip + rule registry cached weekly)
4. **Trivy** — Dependency vulnerability scan (binary + cache cached weekly)
5. **Build** — Production build via Angular CLI

## Constitution

This project follows a formal constitution defining four core principles:
**Strict TypeScript**, **Standalone Components**, **SCSS Styling**, and
**100% Test Coverage** via TDD (Red/Green).

See [`.specify/memory/constitution.md`](.specify/memory/constitution.md).

## License

MIT
