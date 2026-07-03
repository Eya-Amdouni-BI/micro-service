package tn.esprit.diet_microservice.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tn.esprit.diet_microservice.entitys.MealPlan;

import java.util.List;

public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {
    @Query("SELECT m FROM MealPlan m WHERE m.nutritionProfile.id = ?1")
    List<MealPlan> findByNutritionProfileId(Long nutritionProfileId);
}