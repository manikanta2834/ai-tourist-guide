# Docker Setup Guide

Complete Docker environment for AI-Powered Virtual Tourist Guide.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- (Optional) Make

## Quick Start

### Option 1: Using Make (Easiest)

```bash
# Build and start all services
cd ai-tourist-guide
make build
make up

# View logs
make logs

# Stop services
make down
```

### Option 2: Using Docker Compose Directly

```bash
cd ai-tourist-guide

# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Services Overview

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| MongoDB | ai-tourist-guide-mongodb | 27017 | Database |
| Backend | ai-tourist-guide-backend | 5000 | API Server |
| Frontend | ai-tourist-guide-frontend | 5173 | React App |
| Nginx (optional) | ai-tourist-guide-nginx | 80 | Reverse Proxy |

## Development Mode

```bash
# Start with hot reload (foreground)
make dev
# OR
docker-compose up

# Access application:
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
# MongoDB: mongodb://localhost:27017
```

## Production Mode

```bash
# Start with Nginx reverse proxy
make production
# OR
docker-compose --profile production up -d

# Access via Nginx:
# Application: http://localhost
```

## Useful Commands

### Database Operations

```bash
# Seed database with Sriperumbudur data
make seed

# Access MongoDB shell
make mongo

# View MongoDB logs
docker-compose logs -f mongodb
```

### Debugging

```bash
# Open shell in backend container
make shell

# View backend logs
make logs-backend

# View frontend logs
make logs-frontend

# Check service status
make status
```

### Cleanup

```bash
# Stop and remove containers
make down

# Remove everything including volumes (DATA LOSS WARNING)
make clean
```

## Environment Variables

Create a `.env` file in the project root (optional):

```env
# Security (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production

# API Keys (optional)
MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token
OPENWEATHER_API_KEY=your_openweather_key
VITE_MAPBOX_TOKEN=pk.your_mapbox_token
```

## Volume Mounts

| Host Path | Container Path | Purpose |
|-----------|---------------|---------|
| `./backend` | `/app` | Backend code (hot reload) |
| `./frontend` | `/app` | Frontend code (hot reload) |
| `./logs` | `/app/logs` | Backend logs |
| `mongodb_data` (volume) | `/data/db` | MongoDB persistence |

## Troubleshooting

### Port Already in Use

```bash
# Check what's using port 5000 or 5173
sudo lsof -i :5000
sudo lsof -i :5173

# Kill process or change ports in docker-compose.yml
```

### MongoDB Connection Issues

```bash
# Check MongoDB health
docker-compose ps

# Restart MongoDB
docker-compose restart mongodb

# Check logs
docker-compose logs mongodb
```

### Hot Reload Not Working

The frontend uses polling for file changes in Docker. If hot reload stops:

```bash
# Restart frontend
docker-compose restart frontend
```

### Permission Denied

```bash
# Fix permissions on logs directory
sudo chown -R $USER:$USER ./logs
sudo chown -R $USER:$USER ./backend
sudo chown -R $USER:$USER ./frontend
```

## Architecture

```
┌─────────────┐
│   Nginx     │ ← Port 80 (Production)
│  (optional) │
└──────┬──────┘
       │
   ┌───┴────┐
   │        │
┌──┴──┐  ┌──┴──┐
│Frontend│  │Backend │
│:5173   │  │:5000   │
└──┬────┘  └──┬───┘
   │          │
   │     ┌────┴────┐
   │     │ MongoDB │
   │     │ :27017  │
   │     └─────────┘
   │
   └────── Hot Reload ──────→ Volume Mounts
```

## Docker Images

| Image | Size | Base |
|-------|------|------|
| Backend | ~200MB | node:20-alpine |
| Frontend | ~200MB | node:20-alpine |
| MongoDB | ~700MB | mongo:7 |
| Nginx | ~20MB | nginx:alpine |

## Health Checks

All services include health checks:
- **MongoDB**: `mongosh --eval "db.adminCommand('ping')"`
- **Backend**: `curl -f http://localhost:5000/health`
- **Frontend**: Implicit via Node.js dev server

## Networks

- **app-network**: Bridge network (172.20.0.0/16)
- Services communicate internally using container names:
  - Backend → MongoDB: `mongodb://mongodb:27017`
  - Frontend → Backend: `http://backend:5000`

## Updating Dependencies

```bash
# Rebuild after package.json changes
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Backup and Restore

```bash
# Backup MongoDB
docker-compose exec mongodb mongodump --out /data/backup

# Restore MongoDB
docker-compose exec mongodb mongorestore /data/backup
```

## Security Notes

- Default JWT secrets are for development only
- MongoDB has no authentication in development mode
- Nginx adds rate limiting and CORS headers
- Use production profile for deployment

## Performance Tips

1. Use Docker Desktop for better file sync performance
2. Allocate at least 4GB RAM to Docker
3. Use `make dev` for development (shows logs in real-time)
4. Use `make up` for background operation

## Support

For issues:
1. Check logs: `make logs`
2. Verify ports are free
3. Ensure Docker daemon is running
4. Try `make clean` and `make up` for fresh start
