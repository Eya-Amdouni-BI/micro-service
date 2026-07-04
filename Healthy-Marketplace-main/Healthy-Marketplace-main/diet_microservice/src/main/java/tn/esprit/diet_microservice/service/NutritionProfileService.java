// service/NutritionProfileService.java
package tn.esprit.diet_microservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.diet_microservice.entitys.NutritionProfile;
import tn.esprit.diet_microservice.repository.NutritionProfileRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
// Service metier qui centralise les operations sur les profils nutritionnels.
public class NutritionProfileService {

    // Repository Spring Data JPA utilise pour lire et ecrire en base de donnees.
    private final NutritionProfileRepository repo;

    /**
     * Recupere tous les profils nutritionnels.
     */
    public List<NutritionProfile> getAll() {
        return repo.findAll();
    }

    /**
     * Recupere un profil par id ou declenche une exception si aucun profil n'existe.
     */
    public NutritionProfile getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("NutritionProfile not found with id: " + id));
    }

    /**
     * Recupere les profils crees pour un utilisateur donne.
     */
    public List<NutritionProfile> getByUserId(String userId) {
        return repo.findByUserId(userId);
    }

    /**
     * Enregistre un nouveau profil nutritionnel.
     */
    public NutritionProfile create(NutritionProfile profile) {
        return repo.save(profile);
    }

    /**
     * Met a jour un profil existant champ par champ pour conserver le meme id.
     */
    public NutritionProfile update(Long id, NutritionProfile updated) {
        NutritionProfile existing = getById(id);
        // Les valeurs envoyees par le client remplacent les anciennes valeurs du profil.
        existing.setUserId(updated.getUserId());
        existing.setWeight(updated.getWeight());
        existing.setHeight(updated.getHeight());
        existing.setAge(updated.getAge());
        existing.setGender(updated.getGender());
        existing.setActivityLevel(updated.getActivityLevel());
        existing.setGoal(updated.getGoal());
        existing.setDailyCalories(updated.getDailyCalories());
        existing.setProteinTarget(updated.getProteinTarget());
        existing.setCarbTarget(updated.getCarbTarget());
        existing.setFatTarget(updated.getFatTarget());
        return repo.save(existing);
    }

    /**
     * Supprime le profil par id. Les MealPlan associes sont aussi supprimes par cascade.
     */
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
