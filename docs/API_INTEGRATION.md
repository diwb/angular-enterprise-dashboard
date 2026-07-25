# API Integration

The project defaults to `demo` mode through `APP_CONFIG`. Real API mode is prepared through a configurable `apiBaseUrl`, functional HTTP interceptor, authorization header injection, and correlation IDs.

Demo data is intentionally isolated in `core/demo` and `core/data`; components do not import mock arrays directly.
