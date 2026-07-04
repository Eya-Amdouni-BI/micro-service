package tn.esprit.diet_microservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableMethodSecurity
// Configuration de securite du microservice.
// Les endpoints applicatifs exigent un JWT valide, sauf ceux explicitement autorises.
public class SecurityConfig {

    // URL du serveur d'identite qui expose les cles publiques pour verifier les JWT.
    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    /**
     * Definit les regles HTTP appliquees par Spring Security.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CORS et CSRF sont desactives ici car le service fonctionne comme API stateless.
                .cors(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Les endpoints techniques et Swagger restent publics.
                        .requestMatchers("/actuator/**", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                        // Toutes les autres routes demandent une authentification.
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        // Active la validation JWT avec la configuration du JwtDecoder.
                        .jwt(Customizer.withDefaults())
                );
        return http.build();
    }

    /**
     * Cree le decodeur JWT charge de telecharger les cles JWK et de valider les tokens.
     */
    @Bean
    public JwtDecoder jwtDecoder() {
        RestTemplate restTemplate = new RestTemplate();
        return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).restOperations(restTemplate).build();
    }
}
