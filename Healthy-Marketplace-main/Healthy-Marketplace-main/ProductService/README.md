# ProductService

ProductService manages product catalog data.

## Responsibilities

- CRUD operations for products
- Publishes logs for product creation and updates
- Only `ROLE_ADMIN` can create, update, or delete products

## Security

- Spring Security method-level authorization enabled
- `@PreAuthorize("hasRole('ADMIN')")` secures POST/PUT/DELETE endpoints

## Run

Normally run through Docker Compose in the root `Healthy-Marketplace-main` folder.
