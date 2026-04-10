# ─── Stage 1: Builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

WORKDIR /app

# Copy workspace manifests first (for layer caching)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json tsconfig.json ./

# Copy lib packages (shared across workspace)
COPY lib/ ./lib/

# Copy only api-server artifact
COPY artifacts/api-server/ ./artifacts/api-server/

# Install all dependencies (needed for build)
RUN pnpm install --no-frozen-lockfile

# Build only the api-server
RUN pnpm --filter @workspace/api-server run build

# ─── Stage 2: Production image ───────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Only copy the compiled output — no source, no devDeps
COPY --from=builder /app/artifacts/api-server/dist ./dist

# Cloud Run always sets PORT automatically; default to 8080 for local testing
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
