# PR Compliance Checklist

**PR:** [PR_NUMBER] | **Branch:** [BRANCH_NAME]
**Reviewer:** [REVIEWER_NAME] | **Date:** [DATE]

**Instructions:** Check each item against the project constitution
(`.specify/memory/constitution.md`). All items MUST pass before merging.

---

## Principle I — Strict TypeScript

- [ ] **P1-01** `strict: true` is enabled in `tsconfig.json`
- [ ] **P1-02** Angular strictness flags are enabled (`strictTemplates`,
      `strictInjectionParameters`, `strictInputAccessModifiers`)
- [ ] **P1-03** `noImplicitOverride` is enabled
- [ ] **P1-04** No `any` type annotations in new/modified code
      *(if any found, verify documented justification is present)*
- [ ] **P1-05** No `@ts-ignore` or `@ts-expect-error` comments
- [ ] **P1-06** No unused variables, parameters, or imports

---

## Principle II — Standalone Components

- [ ] **P2-01** No `@NgModule()` decorators in application code
- [ ] **P2-02** All new components/directives/pipes use
      `standalone: true` (default in Angular 22)
- [ ] **P2-03** Dependencies are imported directly via `imports` array,
      not through NgModules
- [ ] **P2-04** No usage of `platformBrowserDynamic()` — uses
      `bootstrapApplication()` instead

---

## Principle III — SCSS Styling

- [ ] **P3-01** All new components have their own `.scss` file via
      `styleUrl` (no inline `styles`)
- [ ] **P3-02** Global styles only in `src/styles.scss`
- [ ] **P3-03** Theme colors reference CSS custom properties
      (`var(--variable-name)`) not hardcoded values
- [ ] **P3-04** No `ViewEncapsulation.None` without documented
      justification
- [ ] **P3-05** No full CSS framework imports (Bootstrap, Material, etc.)

---

## Principle IV — 100% Coverage / TDD

- [ ] **P4-01** New components/services/pipes/guards have corresponding
      `.spec.ts` files
- [ ] **P4-02** Tests follow the naming pattern:
      `"should [expected behavior] when [condition]"`
- [ ] **P4-03** Tests use `TestBed.configureTestingModule()` with
      `imports: [Component]` for standalone components
- [ ] **P4-04** External services are mocked with `useValue` and `vi.fn()`
- [ ] **P4-05** `ng test` passes with zero failures
- [ ] **P4-06** Coverage does not decrease from baseline
      *(run `npm run test:coverage` to verify)*
- [ ] **P4-07** Red/green discipline was followed: test written first,
      implementation second

---

## General Compliance

- [ ] **G-01** All signals-based reactivity (no RxJS `BehaviorSubject`
      for component state)
- [ ] **G-02** Template uses new control flow (`@if`, `@for`, `@switch`,
      `@defer`) not structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`)
- [ ] **G-03** No browser-only APIs (`window`/`document`) in constructors
      — uses `isPlatformBrowser` or `afterNextRender` where needed
- [ ] **G-04** Commit messages follow the convention:
      `type(scope): description`

---

## Review Decision

- [ ] **PASS** — All items checked, no violations
- [ ] **PASS WITH NOTES** — Minor violations documented and acknowledged
- [ ] **BLOCKED** — Violations requiring amendment or rework

**Reviewer Notes:**

```
[Add any notes, justifications for exceptions, or amendment requests]
```
