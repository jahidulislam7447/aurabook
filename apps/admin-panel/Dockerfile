FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/admin-panel/package.json apps/admin-panel/package-lock.json* ./apps/admin-panel/
COPY packages/types/package.json packages/types/package-lock.json* ./packages/types/
COPY packages/ui/package.json packages/ui/package-lock.json* ./packages/ui/

RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/admin-panel/node_modules ./apps/admin-panel/node_modules
COPY --from=deps /app/packages/types/node_modules ./packages/types/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules

COPY . .

WORKDIR /app/apps/admin-panel
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder /app/apps/admin-panel/public ./public
COPY --from=builder /app/apps/admin-panel/.next/standalone ./
COPY --from=builder /app/apps/admin-panel/.next/static ./.next/static

USER nodejs

EXPOSE 3002
ENV PORT 3002

CMD ["node", "server.js"]
