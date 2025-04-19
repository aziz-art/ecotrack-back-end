# Ecotrack Backend Architecture

This document describes the architecture of the Ecotrack backend system.

## Overview

- Node.js backend using Express framework
- MySQL database for persistent storage (WordPress integration)
- Redis for caching
- JWT for authentication
- WebSocket for real-time communication
- Stripe for payment processing
- Cron jobs for scheduled tasks (weather alerts, data cleanup)

## Directory Structure

- config/: Configuration files for database, Redis, and authentication
- routes/: Express route definitions
- controllers/: Business logic for handling requests
- models/: Data models representing database tables
- middleware/: Express middleware for auth, cache, validation
- services/: Advanced business logic and integrations
- utils/: Utility functions
- scripts/: Scheduled tasks
- docs/: Documentation
- __tests__/: Unit and integration tests
- logs/: Application logs

## Deployment

- Docker and docker-compose for containerized deployment
- CI/CD workflows in .github/workflows
