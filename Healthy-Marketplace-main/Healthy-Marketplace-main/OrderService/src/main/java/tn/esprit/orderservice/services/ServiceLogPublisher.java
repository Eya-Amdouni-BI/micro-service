package tn.esprit.orderservice.services;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Component
public class ServiceLogPublisher {

    private static final String LOG_EXCHANGE = "service.logs";
    private static final String LOG_ROUTING_KEY = "service.log";

    private final RabbitTemplate rabbitTemplate;

    public ServiceLogPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publish(String service, String level, String message, Map<String, Object> meta) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("timestamp", Instant.now().toString());
        payload.put("service", service);
        payload.put("level", level);
        payload.put("message", message);
        payload.put("meta", meta != null ? meta : new HashMap<>());
        rabbitTemplate.convertAndSend(LOG_EXCHANGE, LOG_ROUTING_KEY, payload);
    }

    public void info(String service, String message, Map<String, Object> meta) {
        publish(service, "INFO", message, meta);
    }

    public void warn(String service, String message, Map<String, Object> meta) {
        publish(service, "WARN", message, meta);
    }

    public void error(String service, String message, Map<String, Object> meta) {
        publish(service, "ERROR", message, meta);
    }
}
