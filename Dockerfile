# Use Node.js 23.7 with Alpine for smaller image size
FROM node:23.7-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies needed for native modules
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Development dependencies stage
FROM base AS deps
RUN npm ci --include=dev

# Build stage
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client if using Prisma (uncomment if needed)
# RUN npx prisma generate

# Build the application
RUN npm run build

# Production dependencies stage
FROM base AS prod-deps
RUN npm ci --omit=dev && npm cache clean --force

# Production stage
FROM node:23.7-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# Copy production dependencies
COPY --from=prod-deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/package*.json ./

# Switch to non-root user
USER nestjs

# Expose port (Railway will set PORT automatically)
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --eval "
    const http = require('http');
    const options = { hostname: 'localhost', port: process.env.PORT || 4000, path: '/api', timeout: 2000 };
    const req = http.request(options, (res) => process.exit(res.statusCode === 404 ? 0 : 1));
    req.on('error', () => process.exit(1));
    req.end();
  "

# Start the application
CMD ["npm", "run", "start:prod"] 