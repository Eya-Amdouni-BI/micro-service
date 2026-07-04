package tn.esprit.diet_microservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.diet_microservice.entitys.NutritionProfile;

import java.util.List;

// Repository Spring Data JPA pour l'entite NutritionProfile.
// JpaRepository fournit deja les methodes CRUD: findAll, findById, save, deleteById, etc.
public interface NutritionProfileRepository extends JpaRepository<NutritionProfile, Long> {

    // Spring Data genere automatiquement la requete a partir du nom de la methode.
    List<NutritionProfile> findByUserId(String userId);
}
