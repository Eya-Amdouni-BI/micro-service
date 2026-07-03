package tn.esprit.diet_microservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.diet_microservice.entitys.NutritionProfile;

import java.util.List;

public interface NutritionProfileRepository extends JpaRepository<NutritionProfile, Long> {
    List<NutritionProfile> findByUserId(String userId);
}