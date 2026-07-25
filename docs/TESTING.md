# Testing

Unit tests cover authentication and demo repository behavior. Playwright covers login, dashboard, customer workflow, RBAC denial, logout, mobile project configuration, and axe accessibility smoke testing.

Latest local validation on 2026-07-25:

- Unit/Vitest: 13 files, 35 tests passed.
- E2E/Playwright Chromium: 5 tests passed, covering login, protected navigation, dashboard, customer search/create, role denial, logout, mobile viewport, and axe accessibility smoke testing.
- Coverage: 91.78% statements, 83.13% branches, 96.49% functions, 91.46% lines.

Coverage excludes page-level visual components with large inline templates from the aggregate threshold because those templates are validated by E2E tests. The unit coverage threshold measures core logic, state services, guards, interceptors, error normalization, and shared component behavior.
