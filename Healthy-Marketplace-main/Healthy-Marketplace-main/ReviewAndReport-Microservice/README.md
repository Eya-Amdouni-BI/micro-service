# ReviewAndReportService

This service handles product reviews and content reports.

## Responsibilities

- Create and retrieve reviews
- Submit and manage content reports
- Protect review deletion and report moderation for admin users

## Security

- Method-level security enabled with `@EnableMethodSecurity`
- `@PreAuthorize("hasRole('ADMIN')")` secures review delete and report moderation endpoints

## Run

Start through Docker Compose from the root `Healthy-Marketplace-main` directory.
