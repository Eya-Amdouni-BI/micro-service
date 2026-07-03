package tn.esprit.diet_microservice.listeners;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import tn.esprit.diet_microservice.service.MealPlanService;

import java.util.Map;

@Component
public class PaymentConfirmedListener {

    private final MealPlanService mealPlanService;

    public PaymentConfirmedListener(MealPlanService mealPlanService) {
        this.mealPlanService = mealPlanService;
    }

    @RabbitListener(queues = "payment.confirmed.queue")
    public void onPaymentConfirmed(Map<String, Object> payload) {
        if (payload == null || !payload.containsKey("orderId")) {
            return;
        }

        String userId = payload.getOrDefault("userId", "unknown").toString();
        System.out.println("Received payment.confirmed for order " + payload.get("orderId") + " user " + userId);

        // Minimal action: ensure a nutrition profile or meal plan path exists for this user
        // TODO: add business logic to create a meal plan / notify diet changes
    }
}
