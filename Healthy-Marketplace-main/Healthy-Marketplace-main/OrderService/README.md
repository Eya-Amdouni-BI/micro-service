# OrderService

OrderService manages customer orders and order events.

## Responsibilities

- Create and update orders
- Publish `order.created` and `order.updated` events via RabbitMQ
- Secure order updates and deletions for admin users only

## Security

- `@PreAuthorize("hasRole('ADMIN')")` is applied to order update/delete endpoints

## Run

This service starts via Docker Compose in the main `Healthy-Marketplace-main` folder.
