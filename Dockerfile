# ---------- deps ----------
FROM node:20-alpine AS deps

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

COPY package.json pnpm-lock.yaml ./

# install SEMUA dependency untuk build
RUN pnpm install --frozen-lockfile


# ---------- builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV DATABASE_URL="mysql://dummy:dummy@localhost:3306/dummy"

RUN pnpm build


# ---------- production ----------
FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

ENV NODE_ENV=production
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary

COPY package.json pnpm-lock.yaml ./

# install production dependency saja
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/generated ./generated

EXPOSE 5050

CMD ["pnpm", "start"]