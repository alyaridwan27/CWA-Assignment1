# -----------------------------------------
# 1. Base Image
# -----------------------------------------
FROM node:18-alpine AS base


# -----------------------------------------
# 2. Dependencies Layer
# -----------------------------------------
FROM base AS deps
WORKDIR /app

# Copy dependencies files
COPY package.json package-lock.json ./

# Install dependencies (no postinstall yet → no prisma)
RUN npm ci --ignore-scripts


# -----------------------------------------
# 3. Builder Layer
# -----------------------------------------
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all project files
COPY . .

# Ensure Prisma schema is present in the container
COPY prisma ./prisma

# Prisma needs a DATABASE_URL to generate the client
# This value is ONLY used during Docker build — runtime will override it.
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cwa?schema=public"

# Generate Prisma Client
RUN npx prisma generate

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js production bundle with standalone output
RUN npm run build


# -----------------------------------------
# 4. Production Runtime Layer
# -----------------------------------------
FROM base AS runner
WORKDIR /app

# Environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create secure user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public files
COPY --from=builder /app/public ./public

# Copy standalone server output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Use the non-root user
USER nextjs

# Expose port
EXPOSE 3000
ENV PORT=3000

# Start the standalone server
CMD ["node", "server.js"]
