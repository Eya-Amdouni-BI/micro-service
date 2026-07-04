// service/MealPlanService.java
package tn.esprit.diet_microservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import tn.esprit.diet_microservice.entitys.MealPlan;
import tn.esprit.diet_microservice.entitys.NutritionProfile;
import tn.esprit.diet_microservice.repository.MealPlanRepository;
import tn.esprit.diet_microservice.repository.NutritionProfileRepository;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
// Service metier qui gere les plans de repas et leur association aux profils nutritionnels.
public class MealPlanService {

    // Repository principal pour les operations CRUD sur MealPlan.
    private final MealPlanRepository repo;

    // Repository du profil nutritionnel, necessaire pour verifier et creer l'association.
    private final NutritionProfileRepository profileRepo;

    /**
     * Recupere tous les plans de repas.
     */
    public List<MealPlan> getAll() {
        return repo.findAll();
    }

    /**
     * Recupere un plan de repas par id ou declenche une exception si absent.
     */
    public MealPlan getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("MealPlan not found with id: " + id));
    }

    /**
     * Recupere les plans de repas rattaches a un profil nutritionnel.
     */
    public List<MealPlan> getByProfileId(Long profileId) {
        // Evite une requete invalide si l'id du profil n'est pas fourni.
        Objects.requireNonNull(profileId, "ProfileId cannot be null");
        
        // Verifie que le profil existe avant de chercher ses plans de repas.
        if (!profileRepo.existsById(profileId)) {
            throw new RuntimeException("NutritionProfile not found with id: " + profileId);
        }
        
        List<MealPlan> mealPlans = repo.findByNutritionProfileId(profileId);
        
        // Garantit une valeur par defaut pour eviter un mealType null dans la reponse API.
        mealPlans.forEach(mp -> {
            if (mp.getMealType() == null) {
                mp.setMealType(MealPlan.MealType.SNACK);
            }
        });
        
        return mealPlans;
    }

    /**
     * Cree un plan de repas et l'associe au profil nutritionnel donne.
     */
    public MealPlan create(Long profileId, MealPlan mealPlan) {
        // Controle les parametres obligatoires avant d'acceder a la base.
        Objects.requireNonNull(profileId, "ProfileId cannot be null");
        Objects.requireNonNull(mealPlan, "MealPlan cannot be null");
        
        NutritionProfile profile = profileRepo.findById(profileId)
                .orElseThrow(() -> new RuntimeException("NutritionProfile not found with id: " + profileId));
        
        // Si le client n'envoie pas le type de repas, on applique SNACK comme valeur par defaut.
        if (mealPlan.getMealType() == null) {
            mealPlan.setMealType(MealPlan.MealType.SNACK);
        }
        
        // Cree la relation ManyToOne avant la sauvegarde JPA.
        mealPlan.setNutritionProfile(profile);
        return repo.save(mealPlan);
    }

    /**
     * Met a jour uniquement les champs non null envoyes par le client.
     */
    public MealPlan update(Long id, MealPlan updated) {
        MealPlan existing = getById(id);
        
        // Chaque champ est teste pour permettre une mise a jour partielle.
        if (updated.getMealType() != null) {
            existing.setMealType(updated.getMealType());
        }
        if (updated.getRecommendedCalories() != null) {
            existing.setRecommendedCalories(updated.getRecommendedCalories());
        }
        if (updated.getRecommendedProductsIds() != null) {
            existing.setRecommendedProductsIds(updated.getRecommendedProductsIds());
        }
        
        return repo.save(existing);
    }

    /**
     * Supprime un plan de repas apres verification de son existence.
     */
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("MealPlan not found with id: " + id);
        }
        repo.deleteById(id);
    }
}
