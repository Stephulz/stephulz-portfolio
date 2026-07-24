# 🚀 Stephulz Portfolio

[![Node](https://img.shields.io/badge/Node-22-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![codecov](https://codecov.io/github/Stephulz/stephulz-portfolio/graph/badge.svg?token=QMPUD6RU8G)](https://codecov.io/github/Stephulz/stephulz-portfolio)
[![CI](https://github.com/Stephulz/stephulz-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Stephulz/stephulz-portfolio/actions/workflows/ci.yml)
[![Quality gate status](https://sonarcloud.io/api/project_badges/measure?project=Stephulz_stephulz-portfolio&metric=alert_status&token=9b1d6858f97188f232e817c7c490e5e743c5ad93)](https://sonarcloud.io/summary/new_code?id=Stephulz_stephulz-portfolio)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://stephulz-portfolio.vercel.app/)

Portfolio built with **Angular 22**, **TypeScript 6**, **SCSS**, and **Jest**. Designed with performance, accessibility, security, and maintainability in mind, and deployed on **Vercel**.

---

## 📚 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚡ Development Commands](#-development-commands)
- [📁 Project Structure](#-project-structure)
- [🔄 CI Pipeline](#-ci-pipeline)
- [📜 Development Standards](#-development-standards)
- [📄 License](#-license)

---

## ✨ Features

- 🌙 Light & Dark themes
- 🌍 Internationalization (English & Portuguese)
- ⚡ Server-Side Rendering (SSR)
- 📱 Responsive design
- 🧪 100% unit test coverage
- 🔒 Automated security scanning
- 🚀 Continuous deployment with Vercel
- 🎨 Modern UI with smooth theme transitions

---

## 🛠️ Tech Stack

| Category | Technology |
| ---------- | ---------- |
| 🎨 Frontend | Angular 22 (Standalone + SSR) |
| 💻 Language | TypeScript 6 (Strict Mode) |
| 🎭 Styling | SCSS + CSS Custom Properties |
| 🧪 Testing | Jest + jsdom |
| 🔍 Linting | Angular ESLint |
| 🔒 Security | Semgrep (SAST), Trivy (Dependency Scanning) |
| 🔄 CI/CD | GitHub Actions |
| 🌐 Hosting | Vercel |
| 🎛️ Feature Flags | ConfigCat |

---

## ⚡ Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Run tests in CI mode
npm run test:ci

# Run tests with coverage
npm run test:coverage

# Lint the project
npm run lint

# Create production build
npm run build
```

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── core/
│   │   ├── models/           # Data interfaces & constants (Experience, Project)
│   │   └── services/         # ThemeService, TranslationService, ConfigCatService
│   ├── mock/
│   │   └── env.mock.ts       # Jest mock for auto-generated env.ts
│   └── shared/
│       ├── components/       # Header, Footer, Timeline, Projects, Toggles, Spinner
│       └── i18n/             # English & Portuguese translations
├── index.html                # Entry point (pre-bootstrap skeleton)
├── styles.scss               # Global styles & theme variables
├── main.ts                   # Client bootstrap
├── main.server.ts            # SSR bootstrap
└── server.ts                 # Express server

public/
└── favicon.ico

coverage/             # Generated coverage reports (gitignored)
```

## 🔄 CI Pipeline

Every push and pull request targeting `main` executes the following workflow:

| Stage | Description |
| ------ | ----------- |
| ✅ Lint | Angular ESLint |
| 🧪 Test | Jest with **100% coverage enforcement** |
| 🔒 SAST | Semgrep security analysis |
| 🛡️ Dependency Scan | Trivy vulnerability scan |
| 🏗️ Build | Production Angular build |

---

## 📜 Development Standards

This project follows a formal development constitution centered around the following principles:

- 💪 Strict TypeScript
- 🧩 Standalone Angular Components
- 🎨 SCSS-first styling
- 🔴🟢 Test-Driven Development (TDD)
- 🧪 100% Test Coverage

---

## 📄 License

This project is licensed under the **MIT License**.
