# SOKONOVA: DevOps & Backend Architecture Guide

This guide explains the architecture and practical implementation of the core DevOps and backend technologies used in the SOKONOVA marketplace.

## 🚀 Overview

SOKONOVA scales by decoupling services, containerizing applications, and automating orchestration.

| Layer | Technologies | Purpose |
|-------|--------------|---------|
| **Infrastructure** | Docker, Kubernetes | Packaging, Orchestration, Scaling |
| **Traffic** | Nginx | Load Balancing, Reverse Proxy |
| **Data** | PostgreSQL, Redis, Prisma | Primary DB, Caching, ORM |
| **Security** | JWT | Stateless Authentication |
| **Observability** | Prometheus, Grafana, Sentry | Metrics, Visualization, Error Tracking |

---

## 🐳 1. Docker — Packaging
**Purpose**: Consistent environments from dev to production.

- **Frontend**: Next.js app packaged in a lightweight container.
- **Backend**: NestJS API packaged with multi-stage builds.
- **Services**: Postgres, Redis, Nginx run as standard containers.

### Usage
Run the full stack locally:
```bash
docker-compose up --build
```
This starts:
- `frontend` (Port 3000)
- `backend` (Port 4000)
- `postgres` (Port 5432)
- `redis` (Port 6379)
- `nginx` (Port 80 - Entry Point)

---

## ☸️ 2. Kubernetes — Orchestration
**Purpose**: Production deployment, scaling, and self-healing.

### Key Resources
All manifests are located in `k8s/`:
- **Deployments**: Define how many replicas of the API/Frontend to run.
- **Services**: Expose deployments to the network (ClusterIP for internal, LoadBalancer for external).
- **Ingress**: Routes external traffic to Nginx/Frontend.
- **HPA (Horizontal Pod Autoscaler)**: Automatically adds pods when CPU > 70%.

---

## 🐘 3. PostgreSQL & Prisma — Data Layer
**Purpose**: Reliable relational storage with type-safe access.

### Integration
- **Prisma Schema**: Defined in `backend/prisma/schema.prisma`.
- **Migrations**: `npx prisma migrate deploy` runs automatically in the container startup command.
- **Access**:
  ```typescript
  // Type-safe query
  const user = await prisma.user.findUnique({ where: { email } });
  ```

---

## ⚡ 4. Redis — Caching & Queues
**Purpose**: High-speed caching for session data, product feeds, and queues.

### Best Practices
- **Cache**: Store expensive query results (e.g., "Popular Products") with an expiry (`EX`).
- **Queues**: Use for background jobs (email sending, image processing) if using Bull/BullMQ.

---

## 🌐 5. Nginx — Load Balancing & Gateway
**Purpose**: distinct entry point, SSL termination, and static caching.

### Configuration
Acts as a reverse proxy in front of the NestJS API and Next.js Frontend.
See `nginx/nginx.conf`:
```nginx
location /api {
    proxy_pass http://backend:4000;
}
```

---

## 🔐 6. JWT — Authentication
**Purpose**: Stateless, scalable security.

- **Flow**: Login -> Receive JWT -> Send JWT in `Authorization: Bearer <token>` header.
- **Validation**: `PassportStrategy` in NestJS verifies the signature without DB lookup.

---

## 📊 7. Observability — Monitoring & Errors

### Prometheus & Grafana
- **Prometheus**: Scrapes `/metrics` endpoint on the backend.
- **Grafana**: Visualizes request rate, latency, and error % dashboards.

### Sentry
- **Real-time**: Captures unhandled exceptions.
- **Context**: Includes stack trace, user ID, and request data.
