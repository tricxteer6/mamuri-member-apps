# syntax=docker/dockerfile:1.6

# ---------- Stage 1: install dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app

# Install build deps for native modules (bcryptjs is pure-JS, but kept for safety)
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi


# ---------- Stage 2: runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=5000

# Tini for proper PID 1 / signal handling
RUN apk add --no-cache tini wget

# Non-root user
RUN addgroup -S app && adduser -S app -G app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY sql ./sql

# Persistent uploads dir
RUN mkdir -p /app/uploads && chown -R app:app /app

USER app

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/server.js"]
