package tn.esprit.diet_microservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;

@SpringBootApplication
@EnableRabbit
@EnableDiscoveryClient
public class DietMicroserviceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DietMicroserviceApplication.class, args);
    }

}
