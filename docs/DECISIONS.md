# Decisions

- Angular 21 standalone components with zoneless change detection.
- Signals and feature services instead of NgRx to avoid unnecessary global complexity.
- ECharts is isolated behind `ChartCardComponent`.
- Demo mode is explicit and separated from component code.
- Node 22.22.0 is used because it is the stable runtime available in the environment.
