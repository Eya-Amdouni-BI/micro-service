# Delivery Service

A Node.js service that tracks deliveries and updates MongoDB based on RabbitMQ events.

## Responsibilities

- Consume order events from RabbitMQ
- Create/update delivery documents in MongoDB
- Expose delivery API endpoints for the frontend

## Run

Managed through Docker Compose in the root `Healthy-Marketplace-main` folder.
