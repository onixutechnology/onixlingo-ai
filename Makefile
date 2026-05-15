.PHONY: up down build logs restart clean db-shell migrate

# --- Docker Commands ---
up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose build --no-cache

logs:
	docker-compose logs -f

restart:
	docker-compose restart

clean:
	docker-compose down -v
	docker system prune -f

# --- Database & App Commands ---
db-shell:
	docker exec -it onix-db psql -U onixu -d onixlingo

backend-shell:
	docker exec -it onix-backend /bin/bash

# --- Production Deployment (Coolify/Generic) ---
deploy: build up
	@echo "🚀 Deployment complete. Checking status..."
	docker-compose ps
