FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
COPY apps/marketing-site/package.json apps/marketing-site/package-lock.json* ./apps/marketing-site/
COPY packages/types/package.json packages/types/package-lock.json* ./packages/types/
COPY packages/ui/package.json packages/ui/package-lock.json* ./packages/ui/

RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/marketing-site/node_modules ./apps/marketing-site/node_modules
COPY --from=deps /app/packages/types/node_modules ./packages/types/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules

COPY . .

# Build the application
WORKDIR /app/apps/marketing-site
RUN npm run build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy the built application
COPY --from=builder /app/apps/marketing-site/public ./public
COPY --from=builder /app/apps/marketing-site/.next/standalone ./
COPY --from=builder /app/apps/marketing-site/.next/static ./.next/static

USER nodejs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
