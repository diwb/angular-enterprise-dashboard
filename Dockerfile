FROM node:22.22.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@9.6.7 && npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
RUN addgroup -S dashboard && adduser -S dashboard -G dashboard
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/angular-enterprise-dashboard/browser /usr/share/nginx/html
RUN touch /run/nginx.pid && chown -R dashboard:dashboard /var/cache/nginx /var/run /run/nginx.pid /usr/share/nginx/html
USER dashboard
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:8080/ || exit 1
