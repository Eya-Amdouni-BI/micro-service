
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
// Controller REST responsable d'exposer les operations HTTP sur les profils nutritionnels.
public class NutritionProfileController {

    // Service injecte par Lombok via @RequiredArgsConstructor.
    // Il contient la logique metier et l'acces au repository.
    private final NutritionProfileService service;

    /**
     * Retourne tous les profils nutritionnels enregistres.
     * Endpoint: GET /api/NutritionProfile
     */
    @GetMapping
    public ResponseEntity<List<NutritionProfile>> getAll() {
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(service.getAll());
    }

    /**
     * Retourne un profil nutritionnel precis a partir de son identifiant.
     * Endpoint: GET /api/NutritionProfile/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<NutritionProfile> getById(@PathVariable Long id) {
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(service.getById(id));
    }

    /**
     * Retourne les profils lies a un utilisateur donne.
     * Endpoint: GET /api/NutritionProfile/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NutritionProfile>> getByUserId(@PathVariable String userId) {
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(service.getByUserId(userId));
    }

    /**
     * Cree un nouveau profil nutritionnel avec les donnees envoyees dans le body JSON.
     * Endpoint: POST /api/NutritionProfile
     */
    @PostMapping
    public ResponseEntity<NutritionProfile> create(@RequestBody NutritionProfile profile) {
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(service.create(profile));
    }

    /**
     * Met a jour un profil existant en remplacant ses champs par ceux recus.
     * Endpoint: PUT /api/NutritionProfile/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<NutritionProfile> update(@PathVariable Long id,
                                                   @RequestBody NutritionProfile profile) {
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(service.update(id, profile));
    }

    /**
     * Supprime un profil nutritionnel et renvoie un message de confirmation.
     * Endpoint: DELETE /api/NutritionProfile/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        service.delete(id);
        // Reponse simple au format JSON pour confirmer la suppression cote client.
        Map<String, String> response = new HashMap<>();
        response.put("message", "NutritionProfile deleted successfully");
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(response);
    }
}
