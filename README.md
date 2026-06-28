# Stephulz Portfolio

[![CI](https://github.com/Stephulz/stephulz-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Stephulz/stephulz-portfolio/actions/workflows/ci.yml)
[![Node](https://img.shields.io/badge/node-22-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)

Personal portfolio built with **Angular 22**, **TypeScript 6**, **SCSS**, and
**Vitest**. Deployed on **Vercel**.

## Stack

| Layer | Tech |
|---|---|
| Framework | Angular 22 (standalone, SSR) |
| Language | TypeScript 6 (strict mode) |
| Styling | SCSS (component-scoped, CSS custom properties) |
| Testing | Vitest + jsdom (100 tests across 9 files) |
| Linting | Angular ESLint |
| Hosting | Vercel (Hobby) |
| CI | GitHub Actions |

## Commands

```bash
# Serve locally
npm start

# Run tests (watch mode)
ng test

# Run tests (CI mode, single run)
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
│   │   ├── models/          # Data interfaces & constants
│   │   └── services/        # ThemeService, TranslationService
│   └── shared/
│       ├── components/      # Header, Footer, Timeline, toggles
│       └── i18n/            # English & Portuguese translations
├── styles.scss              # Global theme variables
└── test-setup.ts            # Vitest global mocks
```

## Constitution

This project follows a formal constitution defining four core principles:
**Strict TypeScript**, **Standalone Components**, **SCSS Styling**, and
**100% Test Coverage** via TDD (Red/Green).

See [`.specify/memory/constitution.md`](.specify/memory/constitution.md).

## License

MIT
