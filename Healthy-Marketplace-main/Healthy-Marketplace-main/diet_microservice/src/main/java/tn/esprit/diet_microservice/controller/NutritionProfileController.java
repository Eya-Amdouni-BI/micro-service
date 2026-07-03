
package tn.esprit.diet_microservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tn.esprit.diet_microservice.entitys.NutritionProfile;
import tn.esprit.diet_microservice.service.NutritionProfileService;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/NutritionProfile")
@RequiredArgsConstructor
public class NutritionProfileController {

    private final NutritionProfileService service;

    @GetMapping
    public ResponseEntity<List<NutritionProfile>> getAll() {
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NutritionProfile> getById(@PathVariable Long id) {
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(service.getById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NutritionProfile>> getByUserId(@PathVariable String userId) {
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(service.getByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<NutritionProfile> create(@RequestBody NutritionProfile profile) {
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(service.create(profile));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NutritionProfile> update(@PathVariable Long id,
                                                   @RequestBody NutritionProfile profile) {
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(service.update(id, profile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        service.delete(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "NutritionProfile deleted successfully");
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(response);
    }
}