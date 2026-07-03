package tn.esprit.diet_microservice.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String PAYMENT_CONFIRMED_QUEUE = "payment.confirmed.queue";
    public static final String EXCHANGE = "healthy-market-exchange";

    @Bean
    public DirectExchange appExchange() {
        return new DirectExchange(EXCHANGE);
    }

    @Bean
    public Queue paymentConfirmedQueue() {
        return new Queue(PAYMENT_CONFIRMED_QUEUE, true);
    }

    @Bean
    public Binding bindingPaymentConfirmed() {
        return BindingBuilder.bind(paymentConfirmedQueue()).to(appExchange()).with("payment.confirmed");
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
