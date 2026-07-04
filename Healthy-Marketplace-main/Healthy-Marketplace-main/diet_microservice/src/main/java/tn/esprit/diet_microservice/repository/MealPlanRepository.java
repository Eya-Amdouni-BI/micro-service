package tn.esprit.diet_microservice.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tn.esprit.diet_microservice.entitys.MealPlan;

import java.util.List;

// Repository Spring Data JPA pour l'entite MealPlan.
// Il herite des operations CRUD standard via JpaRepository.
public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {

    // Requete JPQL qui recupere les plans de repas par l'id du profil nutritionnel associe.
    @Query("SELECT m FROM MealPlan m WHERE m.nutritionProfile.id = ?1")
    List<MealPlan> findByNutritionProfileId(Long nutritionProfileId);
}
