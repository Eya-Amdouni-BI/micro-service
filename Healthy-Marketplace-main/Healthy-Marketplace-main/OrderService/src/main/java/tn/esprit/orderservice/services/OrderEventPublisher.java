package tn.esprit.orderservice.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import tn.esprit.orderservice.config.RabbitConfig;
import tn.esprit.orderservice.entities.Order;

import java.util.HashMap;
import java.util.Map;

@Service
public class OrderEventPublisher {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public OrderEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishOrderCreated(Order order) {
        publish("order.created", order);
    }

    public void publishPaymentConfirmed(Order order) {
        publish("payment.confirmed", order);
    }

    public void publishOrderUpdated(Order order) {
        publish("order.updated", order);
    }

    private void publish(String routingKey, Order order) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("orderId", order.getId());
        payload.put("userId", order.getUserId());
        payload.put("totalPrice", order.getTotalPrice());
        payload.put("status", order.getStatus());
        payload.put("createdAt", order.getCreatedAt() != null ? order.getCreatedAt().toString() : null);

        try {
            String payloadJson = objectMapper.writeValueAsString(payload);
            rabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE, routingKey, payloadJson);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize order event payload", e);
        }
    }
}
