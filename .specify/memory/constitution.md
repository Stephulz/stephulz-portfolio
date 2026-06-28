# Angular 22 Project Constitution

## Core Principles

### I. Strict TypeScript Enforcement

TypeScript is the foundational language for this project; strict typing requirements ensure type safety throughout all code:

* ALL files must use `strict` mode with maximum strictness settings enabled (`noImplicitAny`, `alwaysStrict`, `strictPropertyInitialization`, etc.)
* Type annotations are mandatory on all function parameters, return values, and class properties. No implicit types allowed except in specific edge caseFs (e.g., arrays of primitives).
* Use modern ECMAScript features from ES2022+ where applicable (e.g., array methods, optional chaining, nullish coalescing).
* ESLint configuration enforces consistent coding standards with automatic fixes for common issues.
* Type guards and narrowing must be used to validate runtime types before casting or accessing typed properties.

### II. Standalone Components Architecture

All Angular components follow a standalone architecture to reduce bundle size and improve developer experience:

* EVERY component must be declared as standalone (`standalone: true`) by default; no module-based components allowed without explicit justification.
* Components import only required providers directly; avoid shared NgModules unless absolutely necessary for complex scenarios.
* Standalone components follow a consistent design pattern (e.g., Atomic Design): each component has a single, focused purpose and clear input/output contracts.
* Component composition is achieved through content projection and input bindings rather than NgModule relationships.

### III. SCSS Styling System

Styling follows SCSS conventions to maintain consistency, scalability, and maintainability across the application:

* ALL styling must be written in SCSS with proper nesting and variable inheritance; raw CSS files are not allowed for new styles.
* Design tokens (CSS variables) define a unified color palette, typography scale, spacing system, and other core design principles; these tokens cannot be overridden without explicit review.
* SCSS follows BEM-like naming conventions or the project's established naming pattern with consistent prefixes.
* Styles are modularized into logical directories (`styles`, `components`, `utilities`) for better organization and reuse.

### IV. 100% Accessibility (a11y) Compliance

Accessibility is a non-negotiable requirement; every component, page, and interaction must be fully accessible to all users:

* ALL interactive elements MUST include appropriate ARIA attributes (`aria-label`, `role`, `aria-expanded`, etc.) when native HTML semantics are insufficient.
* Color contrast ratios between foreground and background must meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).
* Every image MUST have descriptive alt text; decorative images use empty alt attributes (`alt=""`).
* Keyboard navigation is mandatory; all interactive elements must be reachable via Tab key and activatable with Enter or Space.
* Focus indicators are visible and clearly defined on all interactive elements; focus traps are tested in modals and dialogs.
* Screen reader compatibility is verified using NVDA, VoiceOver, or JAWS; all dynamic content updates (e.g., form errors, notifications) must be announced programmatically (`aria-live` regions).

## Governance

The Angular 22 Project Constitution supersedes all other development practices within this project:

* All pull requests MUST include evidence of compliance with each principle through comments or linked documentation.
* Any deviation from these principles requires documented justification and approval from the tech lead.
* This constitution is automatically updated via `.specify/extensions.yml` hooks to ensure consistency across iterations.

**Version**: 1.0.0 | **Ratified**: 2026-06-25 | **Last Amended**: 2026-06-25
