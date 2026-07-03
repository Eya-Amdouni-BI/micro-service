
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
public class MealPlanController {

    private final MealPlanService service;

    @GetMapping
    public ResponseEntity<List<MealPlan>> getAll() {
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MealPlan> getById(@PathVariable Long id) {
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(service.getById(id));
    }

    @GetMapping("/profile/{profileId}")
    public ResponseEntity<List<MealPlan>> getByProfileId(@PathVariable Long profileId) {
        List<MealPlan> mealPlans = service.getByProfileId(profileId);
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(mealPlans);
    }

    // POST with profileId as query param: /api/MealPlan?profileId=1
    @PostMapping
    public ResponseEntity<MealPlan> create(@RequestParam Long profileId,
                                           @RequestBody MealPlan mealPlan) {
        MealPlan created = service.create(profileId, mealPlan);
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MealPlan> update(@PathVariable Long id,
                                           @RequestBody MealPlan mealPlan) {
        MealPlan updated = service.update(id, mealPlan);
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        service.delete(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "MealPlan deleted successfully");
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(response);
    }
}