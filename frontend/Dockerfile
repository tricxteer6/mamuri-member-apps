# syntax=docker/dockerfile:1.6

# ---------- Stage 1: build the Vite app ----------
FROM node:20-alpine AS build
WORKDIR /app

# Build-time env (Vite bakes these at build time)
ARG VITE_API_URL=/api
ARG VITE_PUBLIC_ORIGIN=
ARG VITE_OFFICE_ADDRESS=
ARG VITE_OFFICE_MAP_EMBED_URL=
ARG VITE_OFFICE_MAP_LINK=
ENV VITE_API_URL=$VITE_API_URL \
    VITE_PUBLIC_ORIGIN=$VITE_PUBLIC_ORIGIN \
    VITE_OFFICE_ADDRESS=$VITE_OFFICE_ADDRESS \
    VITE_OFFICE_MAP_EMBED_URL=$VITE_OFFICE_MAP_EMBED_URL \
    VITE_OFFICE_MAP_LINK=$VITE_OFFICE_MAP_LINK

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .
RUN npm run build


# ---------- Stage 2: serve with Nginx ----------
FROM nginx:1.27-alpine AS runtime

# Custom config: SPA fallback + optional reverse-proxy to backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
