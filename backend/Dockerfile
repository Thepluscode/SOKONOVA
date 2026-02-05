FROM node:20-alpine

WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
