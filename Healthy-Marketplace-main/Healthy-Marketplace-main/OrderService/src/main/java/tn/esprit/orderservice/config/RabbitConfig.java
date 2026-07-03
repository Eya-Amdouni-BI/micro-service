package tn.esprit.orderservice.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    // Queue names used by the order microservice for RabbitMQ messaging.
    // These names must match producers and consumers across the distributed system.
    public static final String ORDER_CREATED_QUEUE = "order.created.queue";
    public static final String PAYMENT_CONFIRMED_QUEUE = "payment.confirmed.queue";
    public static final String ORDER_UPDATED_QUEUE = "order.updated.queue";

    // Single direct exchange where all order-related routing keys are published.
    public static final String EXCHANGE = "healthy-market-exchange";

    @Bean
    public DirectExchange appExchange() {
        // DirectExchange routes messages to queues based on exact routing keys.
        return new DirectExchange(EXCHANGE);
    }

    @Bean
    public Queue orderCreatedQueue() {
        // Durable queue for new orders, survives broker restart.
        return new Queue(ORDER_CREATED_QUEUE, true);
    }

    @Bean
    public Queue paymentConfirmedQueue() {
        // Durable queue for confirmed payment events.
        return new Queue(PAYMENT_CONFIRMED_QUEUE, true);
    }

    @Bean
    public Binding bindingOrderCreated() {
        // Bind the orderCreatedQueue to the exchange using routing key "order.created".
        return BindingBuilder.bind(orderCreatedQueue()).to(appExchange()).with("order.created");
    }

    @Bean
    public Binding bindingPaymentConfirmed() {
        // Bind the paymentConfirmedQueue to receive payment confirmation events.
        return BindingBuilder.bind(paymentConfirmedQueue()).to(appExchange()).with("payment.confirmed");
    }

    @Bean
    public Queue orderUpdatedQueue() {
        // Durable queue for order update notifications.
        return new Queue(ORDER_UPDATED_QUEUE, true);
    }

    @Bean
    public Binding bindingOrderUpdated() {
        // Bind the orderUpdatedQueue to the exchange using routing key "order.updated".
        return BindingBuilder.bind(orderUpdatedQueue()).to(appExchange()).with("order.updated");
    }

    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        // Use JSON serialization for message payloads so Java objects are converted automatically.
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        // RabbitTemplate is used to send messages to RabbitMQ.
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter());
        return rabbitTemplate;
    }
}
