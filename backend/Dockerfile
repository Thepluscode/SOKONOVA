FROM node:20-alpine

ARG CACHEBUST=1

WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN echo "CACHEBUST=${CACHEBUST}" && npm ci

# Copy source
COPY . .

# Build
RUN npm run build

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["sh", "-c", "set -ex; echo \"PORT=$PORT\"; npx prisma migrate deploy; echo \"MIGRATIONS DONE\"; ls -la dist; node dist/main.js || (echo \"NODE EXIT $?\"; sleep 3600)"]
