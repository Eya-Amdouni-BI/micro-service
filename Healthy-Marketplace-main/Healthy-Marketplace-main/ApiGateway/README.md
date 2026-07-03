# API Gateway

The API Gateway is the entry point for all client requests and performs:

- JWT validation and token relay
- Role-based authorization based on Keycloak roles
- Route forwarding to backend services
- CORS configuration

### Important endpoints

- `/api/products/**` -> ProductService
- `/api/orders/**` -> OrderService
- `/api/reviews/**` -> ReviewAndReportService
- `/api/reports/**` -> ReviewAndReportService
- `/api/posts/**` -> ForumService
- `/api/v1/deliveries/**` -> Delivery Service

### Security

- Public docs and actuator endpoints are permitted
- Admin-only write endpoints are protected in Gateway with `hasRole("ADMIN")`
