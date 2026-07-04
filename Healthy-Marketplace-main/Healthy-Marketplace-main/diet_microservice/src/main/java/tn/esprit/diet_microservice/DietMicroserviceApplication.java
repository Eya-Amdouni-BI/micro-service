package tn.esprit.diet_microservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;

@SpringBootApplication
@EnableRabbit
@EnableDiscoveryClient
// Point d'entree du microservice Diet.
// Spring Boot charge la configuration, les controllers, les services,
// les repositories JPA, RabbitMQ et l'enregistrement dans le service discovery.
public class DietMicroserviceApplication {

    public static void main(String[] args) {
        // Lance l'application Spring Boot et demarre le serveur embarque.
        SpringApplication.run(DietMicroserviceApplication.class, args);
    }

}
