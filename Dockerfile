FROM node:22-slim AS base
RUN npm install -g pnpm@10

WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/config/ ./packages/config/
COPY packages/schemas/ ./packages/schemas/
COPY packages/db/ ./packages/db/
COPY apps/api/ ./apps/api/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter bunman-api build

FROM node:22-slim AS runner
RUN npm install -g pnpm@10

WORKDIR /app
COPY --from=base /app/ ./

ENV NODE_ENV=production
ENV PORT=10000
ENV HOST=0.0.0.0

EXPOSE 10000
CMD ["node", "apps/api/dist/server.js"]
