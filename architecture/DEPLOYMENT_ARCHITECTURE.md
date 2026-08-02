# Incubation Platform - Production Architecture & Deployment Guide

## Architecture Diagram

```
                           ┌─────────────────────────────────────┐
                           │           INTERNET / CDN            │
                           └──────────┬──────────┬───────────────┘
                                      │          │
                              ┌───────▼──┐  ┌────▼──────────────┐
                              │CloudFront│  │   Route 53 DNS    │
                              │  (CDN)   │  │ api.yourdomain.com│
                              │ Videos/  │  └────┬──────────────┘
                              │ Assets   │       │
                              └───┬──────┘       │
                                  │         ┌────▼──────────────┐
                            ┌─────▼───┐     │  AWS ALB          │
                            │ S3      │     │  (Load Balancer)  │
                            │ Bucket  │     │  Health: /health  │
                            └─────────┘     └────┬──────────────┘
                                                 │
                                    ┌────────────┼────────────────┐
                                    │            │                │
                               ┌────▼───┐  ┌────▼───┐      ┌────▼───┐
                               │EC2 #1  │  │EC2 #2  │ ...  │EC2 #N  │
                               │        │  │        │      │(max 10)│
                               └────┬───┘  └────┬───┘      └────┬───┘
                                    │            │               │
                    Each EC2 instance runs:
                    ┌─────────────────────────────────────────────────┐
                    │                  NGINX (port 80/443)            │
                    │  • Rate limiting (30r/s general, 5r/m auth)    │
                    │  • Proxy cache (GET /courses, 30s TTL)         │
                    │  • SSL termination + security headers          │
                    │  • gzip compression                            │
                    └─────────────────┬───────────────────────────────┘
                                      │ upstream: localhost:5000
                    ┌─────────────────▼───────────────────────────────┐
                    │              PM2 CLUSTER (port 5000)            │
                    │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
                    │  │Worker 0│ │Worker 1│ │Worker 2│ │Worker 3│   │
                    │  │Node.js │ │Node.js │ │Node.js │ │Node.js │   │
                    │  └────────┘ └────────┘ └────────┘ └────────┘   │
                    │  • Express 4.19 + Helmet + CORS                │
                    │  • Graceful shutdown (wait_ready)              │
                    │  • Rolling reload (zero downtime)              │
                    └─────────┬────────────────────┬──────────────────┘
                              │                    │
                   ┌──────────▼──────┐   ┌─────────▼─────────┐
                   │  MongoDB Atlas  │   │  ElastiCache Redis │
                   │  (Replica Set)  │   │  (2-node cluster)  │
                   │                 │   │                    │
                   │ • secondaryPref │   │ • Stampede protect │
                   │ • Cluster pool  │   │ • Cache warmup     │
                   │ • All indexed   │   │ • Auto-failover    │
                   └─────────────────┘   └────────────────────┘
```

---

## Capacity Estimates

| Scenario       | Concurrent Users | Config                                           | Monthly AWS Cost |
| -------------- | ---------------- | ------------------------------------------------ | ---------------- |
| **Starter**    | 1,000–2,000      | 1× t3.medium, standalone Redis                   | ~$50             |
| **Growth**     | 5,000–10,000     | 2× t3.medium, ElastiCache 1 node                 | ~$200            |
| **Scale**      | 20,000–50,000    | 4× t3.large, ElastiCache 2 nodes                 | ~$600            |
| **Enterprise** | 100,000+         | 6–10× t3.xlarge, ElastiCache 3 nodes, CloudFront | ~$1,500          |

### Latency Targets

| Request Type         | Target    | How Achieved                         |
| -------------------- | --------- | ------------------------------------ |
| Cached GET (courses) | <10ms     | Redis cache + Nginx proxy cache      |
| Database read        | <50ms     | MongoDB indexes + connection pooling |
| Auth (login/signup)  | <200ms    | bcrypt rounds + JWT generation       |
| File upload (S3)     | <500ms    | Pre-signed URLs (direct to S3)       |
| Video streaming      | CDN-speed | CloudFront edge locations            |

### Cost Breakdown (Enterprise Tier)

| Resource       | Spec               | Monthly        |
| -------------- | ------------------ | -------------- |
| EC2 (ASG 2–10) | t3.xlarge × 6 avg  | ~$700          |
| ALB            | Pay-per-request    | ~$50           |
| ElastiCache    | cache.t3.small × 2 | ~$100          |
| CloudFront     | 1TB transfer       | ~$85           |
| S3             | 100GB storage      | ~$3            |
| MongoDB Atlas  | M30 replica set    | ~$500          |
| **Total**      |                    | **~$1,438/mo** |

---

## File Structure

```
project/
├── backend/
│   ├── Dockerfile                    # Multi-stage production build
│   ├── .dockerignore                 # Build exclusions
│   ├── ecosystem.config.js           # PM2 cluster configuration
│   ├── package.json                  # Scripts: start:cluster, reload, docker:*
│   └── src/
│       ├── server.js                 # PM2 lifecycle + graceful shutdown
│       ├── app.js                    # Express + Helmet CSP + rate limiting
│       ├── config/
│       │   └── db.js                 # Cluster-aware pool + readPreference
│       └── infrastructure/
│           ├── cache/
│           │   └── redis.js          # TCP keepalive + reconnect hardening
│           └── observability/
│               ├── metrics.js        # P50/P95/P99 latency + status codes
│               └── logger.js         # Structured JSON logs + levels
├── docker-compose.yml                # 3-service stack (backend+redis+nginx)
└── infra/
    ├── nginx/
    │   ├── nginx.conf                # Production: SSL, rate limits, cache
    │   └── nginx-docker.conf         # Docker: service-name-based upstream
    ├── aws/
    │   └── aws-infrastructure.yml    # CloudFormation: ALB, ASG, CDN, Redis
    └── scripts/
        ├── deploy.sh                 # Zero-downtime PM2/Docker deploy
        ├── setup-ssl.sh              # Let's Encrypt + auto-renewal
        └── monitor.sh                # Health check loop + alerting
```

---

## Deployment Commands

### Local Development

```bash
cd backend
npm install
npm run dev                           # Node.js watch mode on port 5000
```

### PM2 Cluster (Single Server)

```bash
cd backend
npm ci --production
npm run start:prod                    # PM2 cluster mode (all CPU cores)
npm run monit                         # Real-time PM2 dashboard
npm run reload                        # Zero-downtime rolling restart
npm run logs                          # Stream worker logs
npm run stop                          # Stop all workers
```

### Docker Compose (Local Stack)

```bash
# Start entire stack (backend + Redis + Nginx)
docker compose up -d --build

# View logs
docker compose logs -f backend

# Scale backend containers
docker compose up -d --scale backend=3

# Stop everything
docker compose down
```

### Docker (Standalone)

```bash
npm run docker:build                  # Build production image
npm run docker:run                    # Run with .env file
```

### AWS Deployment

```bash
# 1. Deploy CloudFormation stack
aws cloudformation deploy \
  --template-file infra/aws/aws-infrastructure.yml \
  --stack-name incubation-platform \
  --parameter-overrides \
    VpcId=vpc-xxxxx \
    SubnetIds=subnet-aaa,subnet-bbb \
    KeyPairName=your-key \
    MongoDBURI='mongodb+srv://...' \
    S3BucketName=your-video-bucket \
  --capabilities CAPABILITY_IAM

# 2. Get outputs
aws cloudformation describe-stacks \
  --stack-name incubation-platform \
  --query 'Stacks[0].Outputs'
```

### SSL Setup

```bash
sudo ./infra/scripts/setup-ssl.sh api.yourdomain.com admin@yourdomain.com
```

### Zero-Downtime Deploy

```bash
# PM2 deploy (default)
./infra/scripts/deploy.sh

# Docker deploy
./infra/scripts/deploy.sh --docker

# Rollback
./infra/scripts/deploy.sh --rollback
```

### Monitoring

```bash
# Continuous monitoring (every 30s)
./infra/scripts/monitor.sh

# Single check (for cron)
./infra/scripts/monitor.sh --once

# Check health endpoint
curl http://localhost:5000/health | jq

# Check metrics
curl http://localhost:5000/metrics | jq

# PM2 process list
pm2 list

# PM2 real-time monitor
pm2 monit
```

---

## Security Checklist

- [x] Helmet.js with strict CSP directives
- [x] HSTS enabled (2 years, includeSubDomains, preload)
- [x] CORS restricted to specific origins
- [x] HTTP parameter pollution prevention
- [x] X-Powered-By header removed
- [x] Trust proxy set in production (ALB)
- [x] 3-tier rate limiting (Nginx zones + express-rate-limit + Redis-backed)
- [x] Auth endpoints: 20 req/15min + Nginx 5r/m
- [x] Payment webhooks: raw body passthrough (signature verification)
- [x] SSL/TLS 1.2+ only, OCSP stapling
- [x] Auto-renewal via certbot cron
- [x] Request ID tracking (X-Request-Id)
- [x] Error stack traces hidden in production
- [x] JSON body limit: 1MB
- [x] Cookie-based auth with httpOnly cookies
- [x] Zod validation on all inputs

## Scaling Roadmap

| Phase | What                                 | Status  |
| ----- | ------------------------------------ | ------- |
| 1     | PM2 cluster mode (multi-core)        | ✅ Done |
| 2     | Nginx reverse proxy + rate limiting  | ✅ Done |
| 3     | AWS CloudFormation (ALB + ASG + CDN) | ✅ Done |
| 4     | MongoDB replica read distribution    | ✅ Done |
| 5     | Redis connection hardening           | ✅ Done |
| 6     | Docker containerization              | ✅ Done |
| 7     | Zero-downtime deployment             | ✅ Done |
| 8     | Security & HTTPS hardening           | ✅ Done |
| 9     | Monitoring (P99 latency, alerts)     | ✅ Done |
| 10    | Architecture documentation           | ✅ Done |
