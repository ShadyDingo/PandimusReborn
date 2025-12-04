# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY apps/desktop/package.json ./apps/desktop/

# Install pnpm if not available, or use npm
RUN npm install -g pnpm || true

# Install dependencies
RUN npm install --workspace=apps/server || \
    (cd apps/server && npm install)

# Copy application files
COPY apps/server ./apps/server
COPY packages ./packages

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "apps/server/src/index.js"]

