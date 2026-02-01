.PHONY: help install dev build test lint clean docker-up docker-down deploy

help:
	@echo "CVniz - Development Makefile"
	@echo ""
	@echo "Available commands:"
	@echo "  make install      - Install all dependencies"
	@echo "  make dev          - Start development environment"
	@echo "  make build        - Build for production"
	@echo "  make test         - Run all tests"
	@echo "  make lint         - Run linting"
	@echo "  make clean        - Clean build files"
	@echo "  make docker-up    - Start Docker services"
	@echo "  make docker-down  - Stop Docker services"
	@echo "  make deploy       - Deploy to production"

install:
	cd backend && npm install
	cd ../web && npm install

dev:
	@echo "Starting development environment..."
	@echo "Make sure Docker services are running: make docker-up"
	cd backend && npm run dev &
	cd ../web && npm run dev

build:
	@echo "Building for production..."
	cd backend && npm run build
	cd ../web && npm run build

test:
	@echo "Running tests..."
	cd backend && npm test

test-coverage:
	@echo "Running tests with coverage..."
	cd backend && npm test -- --coverage

lint:
	@echo "Running linting..."
	cd backend && npm run lint

lint-fix:
	@echo "Fixing linting issues..."
	cd backend && npm run lint:fix

docker-up:
	@echo "Starting Docker services..."
	cd docker && docker-compose up -d
	@echo "Services starting... (wait ~30 seconds)"
	@echo ""
	@echo "Services will be available at:"
	@echo "  Backend:   http://localhost:3001"
	@echo "  Frontend:  http://localhost:5173"
	@echo "  MongoDB:   localhost:27017"
	@echo "  Redis:     localhost:6379"

docker-down:
	@echo "Stopping Docker services..."
	cd docker && docker-compose down

docker-logs:
	cd docker && docker-compose logs -f

docker-clean:
	@echo "Cleaning Docker volumes..."
	cd docker && docker-compose down -v

clean:
	@echo "Cleaning build files..."
	rm -rf backend/dist backend/coverage
	rm -rf web/dist
	rm -rf node_modules

indexes:
	@echo "Creating database indexes..."
	cd backend && npm run create-indexes

migration:
	@echo "Creating migration..."
	cd backend && npm run migrate

seed-data:
	@echo "Seeding sample data..."
	cd backend && npm run seed

## Development workflow
setup: install docker-up
	@echo ""
	@echo "✅ Setup complete!"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Update .env file with your config"
	@echo "  2. Run: make dev"
	@echo "  3. Open browser: http://localhost:5173"

## Production commands
prod-build:
	@echo "Building production images..."
	docker build -t cvniz-backend:latest ./backend
	docker build -t cvniz-frontend:latest ./web

prod-deploy:
	@echo "Deploying to production..."
	@echo "Make sure Coolify is configured"
	git push origin main

prod-logs:
	@echo "View production logs in Coolify dashboard"
	@echo "URL: http://your-server-ip:8000"

.DEFAULT_GOAL := help
