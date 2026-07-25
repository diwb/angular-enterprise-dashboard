# Deployment

The SPA can be built with `npm run build` and served by the included Docker/Nginx image:

```bash
docker build -t angular-enterprise-dashboard .
docker run --rm -p 8080:8080 angular-enterprise-dashboard
```

Direct navigation uses Nginx `try_files` fallback to `index.html`.

Local validation on 2026-07-25 returned HTTP 200 for `/` and `/customers`.
