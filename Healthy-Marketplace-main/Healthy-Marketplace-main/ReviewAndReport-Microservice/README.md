# Review and Report Microservice

This microservice handles the management of reviews and reports submitted by users for products and other forum contents. It is a critical component for maintaining the quality of the content on the Healthy Marketplace platform.

## Features

- **Review Management**: Users can create, read, and delete product reviews. Integration with ProductService verifies product validity using Feign.
- **Report Management**: Users can open reports against content ( posts or reviews). Administrators can view reports and update their status (OPEN, IN_PROGRESS, RESOLVED).
- **Security Check**: Integration with the overall Keycloak-based Security setup within the API Gateway (`HasRole` validations for specific operations).
- **Swagger Documentation**: Accessible through the Centralized API Gateway Swagger UI, making the API exploratory and tester-friendly.

## API Documentation

This project exposes OpenAPI 3 documentation automatically. Thanks to **Springdoc**, the API Gateway acts as a central hub where the Swagger JSON files from all microservices are gathered.

1. Start all microservices (Eureka, API Gateway, and ReviewAndReport)
2. Navigate to `http://localhost:<api_gateway_port>/webjars/swagger-ui/index.html`
3. In the "Select a definition" dropdown, select `ReviewReportService`.

## Communication

- **Synchronous**: Uses OpenFeign to communicate with the `ProductService`.
- **Asynchronous**: Uses RabbitMQ for event streaming (like `ReviewCreatedEvent`) ensuring low-coupling and system scalability.

## Data Persistence

The service is currently scoped to leverage the **H2 database** (for easy deployment and testing), connected via Spring Data JPA. Database state resets on application reboots.
