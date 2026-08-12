# ---- Stage 1: install dependencies ----
FROM node:22-alpine AS deps  
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm install

ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

# ---- Stage 2: build ----
FROM node:22-alpine AS builder  
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

# Bring over all node_modules containing the default generated Prisma client
COPY --from=deps /app/node_modules ./node_modules
COPY . . 

ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV DATABASE_URL=$DATABASE_URL

RUN npm run build

# ---- Stage 3: run ----
FROM node:22-alpine AS runner  
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

RUN apk add --no-cache openssl libc6-compat

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Next.js standalone setup
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# ADDED: Explicitly pull standard Prisma engine folders for the standalone build
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/health || exit 1

CMD ["node", "server.js"]
