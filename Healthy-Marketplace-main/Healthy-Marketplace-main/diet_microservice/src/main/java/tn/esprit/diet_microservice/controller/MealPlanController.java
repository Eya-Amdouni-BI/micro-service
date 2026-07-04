
package tn.esprit.diet_microservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import tn.esprit.diet_microservice.entitys.MealPlan;
import tn.esprit.diet_microservice.service.MealPlanService;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/MealPlan")
@RequiredArgsConstructor
// Controller REST qui expose les operations HTTP sur les plans de repas.
public class MealPlanController {

    // Service qui porte la logique metier des MealPlan.
    private final MealPlanService service;

    /**
     * Retourne tous les plans de repas.
     * Endpoint: GET /api/MealPlan
     */
    @GetMapping
    public ResponseEntity<List<MealPlan>> getAll() {
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(service.getAll());
    }

    /**
     * Retourne un plan de repas selon son identifiant.
     * Endpoint: GET /api/MealPlan/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<MealPlan> getById(@PathVariable Long id) {
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(service.getById(id));
    }

    /**
     * Retourne tous les plans de repas lies a un profil nutritionnel.
     * Endpoint: GET /api/MealPlan/profile/{profileId}
     */
    @GetMapping("/profile/{profileId}")
    public ResponseEntity<List<MealPlan>> getByProfileId(@PathVariable Long profileId) {
        List<MealPlan> mealPlans = service.getByProfileId(profileId);
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(mealPlans);
    }

    /**
     * Cree un plan de repas et le rattache au profil nutritionnel passe en parametre.
     * Endpoint: POST /api/MealPlan?profileId=1
     */
    @PostMapping
    public ResponseEntity<MealPlan> create(@RequestParam Long profileId,
                                           @RequestBody MealPlan mealPlan) {
        MealPlan created = service.create(profileId, mealPlan);
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(created);
    }

    /**
     * Met a jour les champs modifiables d'un plan de repas existant.
     * Endpoint: PUT /api/MealPlan/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<MealPlan> update(@PathVariable Long id,
                                           @RequestBody MealPlan mealPlan) {
        MealPlan updated = service.update(id, mealPlan);
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(updated);
    }

    /**
     * Supprime un plan de repas et renvoie un message de confirmation.
     * Endpoint: DELETE /api/MealPlan/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        service.delete(id);
        // Map utilisee pour produire une reponse JSON simple: {"message": "..."}.
        Map<String, String> response = new HashMap<>();
        response.put("message", "MealPlan deleted successfully");
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(response);
    }
}
