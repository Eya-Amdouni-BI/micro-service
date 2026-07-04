package tn.esprit.diet_microservice.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
// Configuration RabbitMQ utilisee pour recevoir les evenements des autres microservices.
public class RabbitConfig {

    // Nom de la queue qui recoit les messages de paiement confirme.
    public static final String PAYMENT_CONFIRMED_QUEUE = "payment.confirmed.queue";

    // Exchange commun de l'application Healthy Marketplace.
    public static final String EXCHANGE = "healthy-market-exchange";

    /**
     * Declare un exchange direct: le message est route selon sa routing key exacte.
     */
    @Bean
    public DirectExchange appExchange() {
        return new DirectExchange(EXCHANGE);
    }

    /**
     * Declare une queue durable pour conserver les messages meme apres redemarrage RabbitMQ.
     */
    @Bean
    public Queue paymentConfirmedQueue() {
        return new Queue(PAYMENT_CONFIRMED_QUEUE, true);
    }

    /**
     * Lie la queue a l'exchange avec la routing key "payment.confirmed".
     */
    @Bean
    public Binding bindingPaymentConfirmed() {
        return BindingBuilder.bind(paymentConfirmedQueue()).to(appExchange()).with("payment.confirmed");
    }

    /**
     * Convertit automatiquement les messages RabbitMQ JSON vers des objets Java.
     */
    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
