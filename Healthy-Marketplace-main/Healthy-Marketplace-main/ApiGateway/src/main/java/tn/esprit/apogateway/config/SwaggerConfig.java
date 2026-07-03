package tn.esprit.apogateway.config;

import org.springdoc.core.properties.SwaggerUiConfigParameters;
import org.springframework.boot.CommandLineRunner;
import org.springframework.cloud.gateway.route.RouteDefinition;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public CommandLineRunner openApiGroups(
            RouteDefinitionLocator locator,
            SwaggerUiConfigParameters swaggerUiParameters) {
        return args -> locator
                .getRouteDefinitions().collectList().block()
                .stream()
                .map(RouteDefinition::getId)
                .filter(id -> id.matches(".*Service")) // Only include route IDs ending with "Service" or modify as needed
                .forEach(id -> {
                    String name = id;
                    String url = "/" + id.toLowerCase() + "/v3/api-docs";
                    swaggerUiParameters.addGroup(name);
                    // Add URL properly without SwaggerUrl object which was removed in recent springdoc versions
                    swaggerUiParameters.addUrl(url);
                });
    }
}
