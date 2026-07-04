package tn.esprit.diet_microservice.listeners;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import tn.esprit.diet_microservice.service.MealPlanService;

import java.util.Map;

@Component
// Listener RabbitMQ qui reagit aux evenements de paiement confirme.
public class PaymentConfirmedListener {

    // Service disponible pour ajouter plus tard une logique de generation de plans de repas.
    private final MealPlanService mealPlanService;

    public PaymentConfirmedListener(MealPlanService mealPlanService) {
        this.mealPlanService = mealPlanService;
    }

    /**
     * Methode appelee automatiquement lorsqu'un message arrive dans payment.confirmed.queue.
     */
    @RabbitListener(queues = "payment.confirmed.queue")
    public void onPaymentConfirmed(Map<String, Object> payload) {
        // Ignore les messages vides ou incomplets pour eviter des traitements invalides.
        if (payload == null || !payload.containsKey("orderId")) {
            return;
        }

        // userId est optionnel dans le message; "unknown" sert de valeur de secours.
        String userId = payload.getOrDefault("userId", "unknown").toString();
        System.out.println("Received payment.confirmed for order " + payload.get("orderId") + " user " + userId);

        // Action minimale actuelle: le message est recu et journalise.
        // TODO: ajouter la logique metier pour creer un plan de repas ou notifier un changement dietetique.
    }
}
