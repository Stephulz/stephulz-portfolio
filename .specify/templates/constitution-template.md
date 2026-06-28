# [PROJECT_NAME] — Angular 22 Constitution

**Version:** 1.0.0
**Ratified:** [RATIFICATION_DATE]
**Last Amended:** [LAST_AMENDED_DATE]

## Preamble

This constitution establishes the non-negotiable technical and process principles
governing the [PROJECT_NAME] project. Every contribution MUST adhere to these
principles. Deviations require a formal amendment (see Governance section).

---

## Core Principles

### I. Strict TypeScript — No `any`, No Loose Typing

The project enforces the strictest available TypeScript and Angular compiler
settings. This is the foundation of code quality, refactoring safety, and
maintainability.

**Rules:**

1. **`strict: true`** MUST remain enabled in `tsconfig.json`.
2. **Angular strictness flags** MUST remain enabled (`strictTemplates`,
   `strictInjectionParameters`, `strictInputAccessModifiers`).
3. **`noImplicitOverride`** MUST remain enabled.
4. **`any` is banned.** Use `unknown` and narrow with type guards. Exceptions
   require a documented justification.
5. **`@ts-ignore` and `@ts-expect-error`** are banned.

**Rationale:** Strict TypeScript catches entire classes of bugs at compile time.
Every `any` is a blind spot.

---

### II. Standalone Components — No NgModules

Every component, directive, and pipe MUST be declared as standalone.

**Rules:**

1. **Do NOT create or import NgModules.** No `@NgModule()` decorator.
2. **Dependencies are imported directly** via the `imports` array.
3. **Application bootstrapping** uses `bootstrapApplication()`, never
   `platformBrowserDynamic()`.
4. **Feature modules** — use directory structure, not NgModules.

**Rationale:** Standalone components eliminate NgModule ceremony and colocate
dependencies with the component that needs them.

---

### III. SCSS Styling — Component-Scoped, Theme-Aware

All styling MUST be authored in SCSS and scoped to the component via `styleUrl`.

**Rules:**

1. **Every component has its own `.scss` file** — no inline `styles`.
2. **Global styles** live in `src/styles.scss` only.
3. **Theme variables** MUST be CSS custom properties on `:root` /
   `[data-theme="dark"]` / `[data-theme="light"]`.
4. **No `ViewEncapsulation.None`** unless explicitly justified.
5. **SCSS features** — nesting, variables, mixins are allowed. No full CSS
   frameworks.

**Rationale:** SCSS provides power without runtime overhead. Component-scoped
styles prevent leakage. CSS custom properties enable runtime theme switching.

---

### IV. 100% Unit Test Coverage — Test-Driven Development (Red/Green)

Every unit of production code MUST have corresponding tests, and the
test-first (red/green) discipline MUST be followed.

**Rules:**

1. **100% line and branch coverage** — every component, service, pipe, guard,
   and resolver MUST have a `.spec.ts` file.
2. **Red/Green discipline:** Write the failing test first (RED), then the
   minimal implementation (GREEN), then refactor.
3. **Test naming:** `"should [expected behavior] when [condition]"`.
4. **Mock services** using Angular providers with `useValue` and `vi.fn()`.
5. **Coverage gates:** `ng test` MUST pass before merging. Coverage MUST NOT
   decrease.

**Rationale:** Red/green TDD ensures every line of production code exists
because a test demanded it. This eliminates untested edge cases.

---

## Technology Stack

| Layer | Choice |
|---|---|
| **Framework** | Angular 22 (standalone, SSR-ready) |
| **Language** | TypeScript 6+ (strict mode, no `any`) |
| **Styling** | SCSS (component-scoped via `styleUrl`, CSS custom properties for theming) |
| **Testing** | Vitest 4+ + jsdom |
| **Coverage** | `vitest --coverage` (100% line + branch target) |
| **Build** | Angular CLI with ESBuild/Vite |
| **Reactivity** | Signals (`signal`, `computed`, `effect`) |
| **Linting** | Angular ESLint |

---

## Governance

1. **Amendment procedure:** Amendments require a PR updating this file. The PR
   MUST include: the specific change, rationale, version bump category.
2. **Versioning:** MAJOR = backward-incompatible changes; MINOR = new
   principles; PATCH = clarifications, wording fixes.
3. **Compliance review:** Every PR MUST be checked against this constitution,
   and a reviewer MUST confirm compliance.
4. **Overriding constitution:** Complexity MUST always be justified. Violations
   require explanation.
