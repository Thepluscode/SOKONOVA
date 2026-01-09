# Vite Frontend Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept build-time environment variables
ARG VITE_API_URL
ARG VITE_PUBLIC_SUPABASE_URL
ARG VITE_PUBLIC_SUPABASE_ANON_KEY

# Set environment variables for Vite build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_PUBLIC_SUPABASE_URL=$VITE_PUBLIC_SUPABASE_URL
ENV VITE_PUBLIC_SUPABASE_ANON_KEY=$VITE_PUBLIC_SUPABASE_ANON_KEY

# Build for production
RUN npm run build

# Production stage - serve with nginx
# Install envsubst (contained in gettext package)
RUN apk add --no-cache gettext

# Copy built assets
COPY --from=builder /app/out /usr/share/nginx/html

# Copy custom nginx config template
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Ensure proper permissions
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# Start nginx with our script
CMD ["/start.sh"]
