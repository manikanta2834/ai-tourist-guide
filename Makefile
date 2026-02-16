# AI Tourist Guide - Docker Commands
.PHONY: help build up down restart logs shell seed clean

# Default command
help:
	@echo "Available commands:"
	@echo "  make build    - Build all Docker images"
	@echo "  make up       - Start all services"
	@echo "  make dev      - Start in development mode (with hot reload)"
	@echo "  make down     - Stop all services"
	@echo "  make restart  - Restart all services"
	@echo "  make logs     - View logs from all services"
	@echo "  make seed     - Seed the database with sample data"
	@echo "  make shell    - Open shell in backend container"
	@echo "  make clean    - Remove all containers and volumes"
	@echo "  make install  - Install dependencies locally"

# Build Docker images
build:
	docker-compose build

# Start services
up:
	docker-compose up -d
	@echo "Services started:"
	@echo "  Frontend: http://localhost:5173"
	@echo "  Backend:  http://localhost:5000"
	@echo "  MongoDB:  localhost:27017"

# Development mode (foreground with logs)
dev:
	docker-compose up

# Stop services
down:
	docker-compose down

# Restart services
restart: down up

# View logs
logs:
	docker-compose logs -f

# View backend logs only
logs-backend:
	docker-compose logs -f backend

# View frontend logs only
logs-frontend:
	docker-compose logs -f frontend

# Seed database
seed:
	docker-compose exec backend npm run seed

# Open shell in backend
shell:
	docker-compose exec backend sh

# Open MongoDB shell
mongo:
	docker-compose exec mongodb mongosh

# Clean everything
clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

# Install dependencies locally (for development without Docker)
install:
	cd backend && npm install
	cd frontend && npm install

# Run tests
test:
	docker-compose exec backend npm test

# Production build
production:
	docker-compose --profile production up -d

# Check status
status:
	docker-compose ps
