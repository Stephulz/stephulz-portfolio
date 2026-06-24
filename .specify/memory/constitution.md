# Stephulz Portfolio — Angular Constitution

## Core Principles

### I. Standalone Components (No NgModules)
Every component, directive, and pipe MUST be declared as standalone (`standalone: true` — the default in Angular 22). Do NOT create or import NgModules. Dependencies are imported directly via the `imports` array in the `@Component` decorator.

### II. Signals-Only Reactivity
Use Angular Signals (`signal()`, `computed()`, `effect()`) for all state management and reactive data flow. Do NOT use RxJS `BehaviorSubject` or manual change detection for component state. RxJS is reserved for external streams (HTTP, router events, form valueChanges).

### III. Modern Control Flow
Use the new template syntax exclusively: `@if`, `@for`, `@switch`, `@defer`. Do NOT use structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`). Always provide a `track` expression in `@for`.

### IV. Functional Guards & Resolvers
All route guards and resolvers MUST be implemented as plain functions using the `canActivate`, `canMatch`, `canDeactivate`, `resolve` APIs from `@angular/router`. Do NOT use class-based guards.

### V. Strict TypeScript & Angular Compiler
The project enforces `strict: true` in TypeScript, plus `strictTemplates`, `strictInjectionParameters`, and `strictInputAccessModifiers` in Angular compiler options. Every template expression must be type-safe. Avoid `any` except in rare, justified cases.

## Technology Stack

| Layer | Choice |
|---|---|
| **Framework** | Angular 22 (standalone, SSR-ready) |
| **Language** | TypeScript 6+ (strict mode) |
| **Styling** | SCSS (component-scoped via `styleUrl`) |
| **Testing** | Vitest + jsdom (Angular Testing Library preferred) |
| **Build** | Angular CLI with ESBuild/Vite |
| **Server** | Angular SSR via Express + `@angular/ssr` |
| **Forms** | Reactive Forms (`FormGroup`, `FormControl`, `Validators`) |
| **Routing** | `provideRouter` with functional guards/resolvers |
| **Reactivity** | Signals (`signal`, `computed`, `effect`) |
| **RxJS** | Only for HTTP, router events, debounced input streams |

## Development Workflow

### Component Structure
```
feature/
├── feature.component.ts      # Standalone component
├── feature.component.html    # Template with @if/@for/@defer
├── feature.component.scss    # Scoped styles
└── feature.component.spec.ts # Vitest unit test
```

### Testing Requirements
- Every component, service, and guard MUST have a corresponding `.spec.ts` file.
- Tests use Vitest with jsdom environment.
- Prefer `provideRouter`, `provideHttpClientTesting` over manual injection.
- Test signals by calling setters and asserting via `effect()` or computed values.

### SSR & Hydration
- Use `provideClientHydration(withEventReplay())` in app config.
- Avoid direct `window`/`document` access; use `isPlatformBrowser` or `afterNextRender`.
- Ensure routes and data are SSR-compatible (no browser-only APIs in constructors).

## Governance
This constitution supersedes generic Angular tutorials or documentation. Amendments require a PR updating both this file and `.specify/templates/constitution-template.md`. Complexity must always be justified — prefer the simplest solution that satisfies the requirements.

**Version**: 1.0.0 | **Ratified**: 2026-06-23 | **Last Amended**: 2026-06-23
