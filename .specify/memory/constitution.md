<!--
  Sync Impact Report
  Version change: N/A → 1.0.0 (initial creation)
  Modified principles: N/A (new document)
  Added sections: Principles I–IV, Technology Stack, Development Workflow, Governance
  Removed sections: None
  Templates requiring updates: ✅ .specify/templates/constitution-template.md (source template already reflects this content)
  Follow-up TODOs: None
-->

# Stephulz Portfolio — Angular 22 Constitution

**Version:** 2.0.0
**Ratified:** 2026-06-28
**Last Amended:** 2026-06-30

## Preamble

This constitution establishes the non-negotiable technical and process principles
governing the Stephulz Portfolio project. Every contribution MUST adhere to these
principles. Deviations require a formal amendment (see Governance section).

---

## Core Principles

### I. Strict TypeScript — No `any`, No Loose Typing

The project enforces the strictest available TypeScript and Angular compiler
settings. This is the foundation of code quality, refactoring safety, and
maintainability.

**Rules:**

1. **`strict: true`** MUST remain enabled in `tsconfig.json`. This implies
   `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`,
   `strictPropertyInitialization`, `noImplicitAny`, `noImplicitThis`, and
   `alwaysStrict`.

2. **Angular strictness flags** MUST remain enabled:
   - `strictTemplates` — every template expression must be type-safe
   - `strictInjectionParameters` — DI resolution errors are compile-time errors
   - `strictInputAccessModifiers` — inputs/outputs must have explicit visibility

3. **`noImplicitOverride`** MUST remain enabled. Every method override MUST use
   the `override` keyword.

4. **`noUnusedLocals`** and **`noUnusedParameters`** — unused code MUST be
   removed before committing.

5. **`any` is banned.** Use `unknown` when the type is truly indeterminate, and
   narrow with type guards. Exceptions require a documented justification in a
   comment above the cast explaining why no other type suffices.

6. **`@ts-ignore` and `@ts-expect-error`** are banned. If a third-party library
   lacks types, create a minimal `.d.ts` declaration file.

**Rationale:** Strict TypeScript catches entire classes of bugs at compile time
before tests ever run. Every `any` is a blind spot. This principle exists to
keep the codebase resilient through upgrades and refactors.

---

### II. Standalone Components — No NgModules

Every component, directive, and pipe MUST be declared as standalone
(`standalone: true`, which is the default in Angular 22).

**Rules:**

1. **Do NOT create or import NgModules.** There must be no `@NgModule()`
   decorator anywhere in the application code.

2. **Dependencies are imported directly** via the `imports` array in the
   `@Component` decorator or via `providers` for injectable services.

3. **Application bootstrapping** uses `bootstrapApplication()` with the
   `providers` array (via `appConfig`), never `platformBrowserDynamic()`.

4. **Feature modules** — if logical grouping is needed, use directory structure
   (e.g., `src/app/features/`) rather than NgModules. Barrel files
   (`index.ts`) are acceptable for re-exporting related components.

5. **Third-party module-based libraries** — if a library only ships as an
   `NgModule`, create a thin wrapper that re-exports its providers and
   components in a standalone-compatible way, and add a comment explaining
   the migration path.

**Rationale:** Standalone components are the Angular 22 default and eliminate
the ceremony, boilerplate, and tree-shaking overhead of NgModules. They make
lazy-loading simpler and colocate dependencies with the component that needs
them.

---

### III. SCSS Styling — Component-Scoped, Theme-Aware

All styling MUST be authored in SCSS (`.scss`) and scoped to the component
via Angular's `styleUrl`.

**Rules:**

1. **Every component has its own `.scss` file** referenced via `styleUrl` in
   the `@Component` decorator. No `styles` inline arrays.

2. **Global styles** live in `src/styles.scss` only (CSS reset, theme
   variables, scrollbar, selection, focus). No other global stylesheets.

3. **Theme variables** MUST be defined as CSS custom properties on
   `:root` / `[data-theme="dark"]` / `[data-theme="light"]` in
   `src/styles.scss`. Component styles MUST reference these variables via
   `var(--variable-name)`.

4. **No `encapsulation: ViewEncapsulation.None`** unless explicitly justified
   and documented. Prefer `:host` and `:host-context()` selectors for
   component-level theming.

5. **SCSS features** — use nesting, variables (`$`), mixins (`@mixin`/`@include`),
   and functions (`@function`) where they reduce repetition. Do NOT import
   full frameworks like Bootstrap or Material — keep the dependency footprint
   minimal.

6. **Responsive design** — use CSS Grid, Flexbox, and `clamp()`/`min()`/`max()`
   for fluid layouts. Avoid framework grid systems.

**Rationale:** SCSS provides the power of nesting, mixins, and variables
without adding runtime overhead. Component-scoped styles prevent leakage and
make refactoring safe. CSS custom properties enable runtime theme switching
without reloading stylesheets.

---

### IV. 100% Unit Test Coverage — Test-Driven Development (Red/Green)

Every unit of production code MUST have corresponding tests, and the
test-first (red/green) discipline MUST be followed: write a failing test
first, then implement the code to make it pass.

**Rules:**

1. **100% coverage** (enforced via `jest --coverage`).
   Every component, service, pipe, guard, and resolver MUST have a
   corresponding `.spec.ts` file.

2. **Red/Green discipline:**
   - **RED:** Write the test first. Run it. Confirm it fails with the
     expected failure message.
   - **GREEN:** Write the minimal implementation to pass the test.
   - **REFACTOR:** Clean up without changing behavior. Re-run tests to
     confirm they still pass.

3. **Test naming convention:** Test descriptions MUST follow the pattern
   `"should [expected behavior] when [condition]"`. Group related tests
   with nested `describe` blocks.

4. **Angular Testing best practices:**
   - Use `TestBed.configureTestingModule()` with `imports: [Component]` for
     standalone components.
   - Mock all injected services using Angular providers with `useValue` and
     `jest.fn()` spies.
   - Test signals by calling their setter and asserting via `fixture.
     detectChanges()` or `TestBed.flushEffects()`.
   - Use `CUSTOM_ELEMENTS_SCHEMA` only in parent components that import
     child components (each child is tested independently).
   - Test both English and Portuguese translations for i18n components.
   - Test server-side rendering (SSR) paths by providing `PLATFORM_ID: 'server'`
     to verify skipped `isPlatformBrowser` branches.

5. **Coverage gates:**
   - `jest` (or `npm test`) MUST pass before merging any PR.
   - Coverage MUST NOT decrease from the established baseline.
   - New code MUST maintain 100% statement, function, and line coverage.
   - Branch coverage must stay above 96% (one known Istanbul false-positive
     on `if/else` closing brace tracking).

6. **Jest configuration:**
   - Preset: `jest-preset-angular` (via `createCjsPreset`)
   - Environment: `jsdom` (configured in `jest.config.js`)
   - Setup files: `setup-jest.ts` (replaces old `src/test-setup.ts`)
   - Module mapper: `^src/(.*)$` → `<rootDir>/src/$1`
   - Coverage: `jest --coverage` (uses Istanbul internally — no extra package needed)
   - Assertions: Jest-native (`jest.fn()`, `jest.spyOn`, `expect` without imports)

7. **What to test in each layer:**
   - **Services:** Creation, default state, all public methods, edge cases
     (invalid inputs, null/undefined), state transitions, side effects
     (localStorage, document attributes).
   - **Components:** Creation, dependency injection, template rendering
     (structure, text content, bindings), user interaction (click handlers),
     conditional rendering (ng-icon/a11y aria attributes), bilingual content.
   - **Pipes/Guards:** Pure logic — input → output mapping, edge cases.

**Rationale:** Red/green TDD ensures every line of production code exists
because a test demanded it. This eliminates untested edge cases and produces
a self-documenting test suite that serves as living specification. 100%
coverage is achievable because this is a portfolio application — there is no
legacy code to exempt.

---

## Technology Stack

| Layer | Choice |
|---|---|
| **Framework** | Angular 22 (standalone, SSR-ready) |
| **Language** | TypeScript 6+ (strict mode, no `any`) |
| **Styling** | SCSS (component-scoped via `styleUrl`, CSS custom properties for theming) |
| **Testing** | Jest 30 + + jsdom + `@angular/build:unit-test` |
| **Coverage** | `jest --coverage` (100% line + branch target) |
| **Build** | Angular CLI with ESBuild/Vite |
| **Server** | Angular SSR via Express + `@angular/ssr` (Vercel-ready) |
| **Routing** | `provideRouter` with functional guards/resolvers |
| **Reactivity** | Signals (`signal`, `computed`, `effect`) |
| **RxJS** | Only for HTTP, router events, debounced input streams |
| **Icons** | `@ng-icons/core` with Bootstrap, Heroicons, Simple Icons, Boxicons, Devicon |
| **Analytics** | `@vercel/analytics` + `@vercel/speed-insights` |
| **Linting** | Angular ESLint (angular-eslint 22) |

---

## Development Workflow

### Component File Structure

```
src/app/
├── core/
│   ├── models/
│   ├── services/
│   └── guards/
├── shared/
│   ├── components/
│   │   └── example/
│   │       ├── example.component.ts      # Standalone component
│   │       ├── example.component.html    # Template (@if/@for/@switch only)
│   │       ├── example.component.scss    # Scoped styles
│   │       └── example.component.spec.ts # Vitest unit test (TDD: write first)
│   └── pipes/
└── features/
    └── example-feature/
        └── ...
```

### Testing Workflow

1. Identify the specific behavior to implement.
2. Write the `.spec.ts` test that asserts that behavior.
3. Run `ng test` — confirm the test FAILS (RED).
4. Write the minimal implementation code.
5. Run `ng test` — confirm the test PASSES (GREEN).
6. Refactor if needed — re-run `ng test` to confirm.
7. Run `ng test --no-watch` — confirm ALL tests pass before committing.
8. Run linting: `ng lint` — confirm zero errors.

### SSR & Hydration

- Use `provideClientHydration(withEventReplay())` in app config.
- Avoid direct `window`/`document` access; use `isPlatformBrowser` or
  `afterNextRender`.
- Ensure routes and data are SSR-compatible (no browser-only APIs in
  constructors).

### Commit Message Convention

```
type(scope): description

feat:     New feature
fix:      Bug fix
test:     Test additions or changes
refactor: Code change with no behavior change
style:    Formatting, linting
docs:     Documentation or constitution updates
chore:    Build, config, dependencies
```

---

## Governance

1. **Amendment procedure:** Amendments to this constitution require a PR that
   updates `.specify/memory/constitution.md`. The PR description MUST include:
   - The specific change and its rationale.
   - The version bump category (MAJOR / MINOR / PATCH).
   - A diff of the affected sections.

2. **Versioning policy:**
   - **MAJOR:** Backward-incompatible principle removals or redefinitions.
   - **MINOR:** New principles or materially expanded guidance.
   - **PATCH:** Clarifications, wording, typo fixes, non-semantic refinements.

3. **Compliance review:** Every PR MUST be checked against this constitution
   before merging. A reviewer MUST explicitly confirm constitution compliance
   or flag violations for amendment.

4. **Overriding constitution:** Complexity MUST always be justified. If a
   solution violates a principle, the PR MUST explain why the simpler
   constitution-compliant approach is insufficient.

5. **This constitution supersedes** generic Angular tutorials, Stack Overflow
   answers, or LLM output. When in doubt, refer to the principles above.
