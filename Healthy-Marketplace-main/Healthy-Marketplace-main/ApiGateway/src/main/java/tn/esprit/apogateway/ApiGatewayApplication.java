package tn.esprit.apogateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.cloud.gateway.filter.factory.DedupeResponseHeaderGatewayFilterFactory.Config;
import org.springframework.cloud.gateway.filter.factory.DedupeResponseHeaderGatewayFilterFactory;

@EnableDiscoveryClient
@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("product", r -> r.path("/api/products/**", "/api/categories/**")
                        .filters(f -> f.tokenRelay()
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE"))
                        .uri("lb://PRODUCTSERVICE"))

                .route("diet", r -> r.path("/api/NutritionProfile/**", "/api/MealPlan/**")
                        .filters(f -> f.tokenRelay())
                        .uri("lb://DIETSERVICE"))
                .route("orders", r -> r.path("/api/orders/**", "/api/payments/**")
                        .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE")
                                .tokenRelay())
                        .uri("lb://ORDERSERVICE"))

                .route("reviewandreports", r -> r.path("/api/reviews/**", "/api/reports/**", "/REVIEWREPORTSERVICE/**")
                        .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE")
                                .rewritePath("/REVIEWREPORTSERVICE/(?<segment>.*)", "/${segment}")
                                .tokenRelay())
                        .uri("lb://REVIEWREPORTSERVICE"))
                .route("forum", r -> r.path("/api/posts/**")
                        .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE")
                                .tokenRelay())
                        .uri("lb://FORUMSERVICE"))

                .route("delivery", r -> r.path("/api/v1/deliveries/**")
                        .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE")
                                .tokenRelay())
                        .uri("lb://DELIVERY-SERVICE"))
                .route("product-openapi", r -> r.path("/v3/api-docs/product")
                        .filters(f -> f.rewritePath("/v3/api-docs/product", "/v3/api-docs"))
                        .uri("lb://PRODUCTSERVICE"))
                .route("order-openapi", r -> r.path("/v3/api-docs/order")
                        .filters(f -> f.rewritePath("/v3/api-docs/order", "/v3/api-docs"))
                        .uri("lb://ORDERSERVICE"))
                .route("forum-openapi", r -> r.path("/v3/api-docs/forum")
                        .filters(f -> f.rewritePath("/v3/api-docs/forum", "/v3/api-docs"))
                        .uri("lb://FORUMSERVICE"))
                .route("reviewreport-openapi", r -> r.path("/v3/api-docs/reviewreport")
                        .filters(f -> f.rewritePath("/v3/api-docs/reviewreport", "/v3/api-docs"))
                        .uri("lb://REVIEWREPORTSERVICE"))
                .route("diet-openapi", r -> r.path("/v3/api-docs/diet")
                        .filters(f -> f.rewritePath("/v3/api-docs/diet", "/v3/api-docs"))
                        .uri("lb://DIETSERVICE"))
                .build();
    }

}
