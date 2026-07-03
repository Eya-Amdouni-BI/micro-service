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
public class MealPlanService {

    private final MealPlanRepository repo;
    private final NutritionProfileRepository profileRepo;

    public List<MealPlan> getAll() {
        return repo.findAll();
    }

    public MealPlan getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("MealPlan not found with id: " + id));
    }

    public List<MealPlan> getByProfileId(Long profileId) {
        Objects.requireNonNull(profileId, "ProfileId cannot be null");
        
        // Verify profile exists
        if (!profileRepo.existsById(profileId)) {
            throw new RuntimeException("NutritionProfile not found with id: " + profileId);
        }
        
        List<MealPlan> mealPlans = repo.findByNutritionProfileId(profileId);
        
        // Ensure mealType is never null
        mealPlans.forEach(mp -> {
            if (mp.getMealType() == null) {
                mp.setMealType(MealPlan.MealType.SNACK); // Default fallback
            }
        });
        
        return mealPlans;
    }

    public MealPlan create(Long profileId, MealPlan mealPlan) {
        Objects.requireNonNull(profileId, "ProfileId cannot be null");
        Objects.requireNonNull(mealPlan, "MealPlan cannot be null");
        
        NutritionProfile profile = profileRepo.findById(profileId)
                .orElseThrow(() -> new RuntimeException("NutritionProfile not found with id: " + profileId));
        
        // Ensure mealType has a default value
        if (mealPlan.getMealType() == null) {
            mealPlan.setMealType(MealPlan.MealType.SNACK);
        }
        
        mealPlan.setNutritionProfile(profile);
        return repo.save(mealPlan);
    }

    public MealPlan update(Long id, MealPlan updated) {
        MealPlan existing = getById(id);
        
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

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("MealPlan not found with id: " + id);
        }
        repo.deleteById(id);
    }
}