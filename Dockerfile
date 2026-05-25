FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9
RUN pnpm config set enable-pre-post-scripts true

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build


FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm@9
RUN pnpm config set enable-pre-post-scripts true

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 5051

CMD ["pnpm", "start"]