package tn.esprit.diet_microservice.entitys;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// Entite JPA qui represente un plan de repas recommande pour un profil nutritionnel.
public class MealPlan {

    // Cle primaire auto-generee par la base de donnees.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Plusieurs MealPlan peuvent appartenir au meme NutritionProfile.
    // FetchType.LAZY evite de charger le profil tant qu'il n'est pas utilise.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nutrition_profile_id")
    @ToString.Exclude
    @JsonIgnore
    private NutritionProfile nutritionProfile;

    // Type de repas stocke sous forme de texte: BREAKFAST, LUNCH, DINNER ou SNACK.
    @Enumerated(EnumType.STRING)
    private MealType mealType;

    // Nombre de calories recommande pour ce repas.
    private Double recommendedCalories;

    // Liste des identifiants de produits recommandes pour composer ce repas.
    @ElementCollection
    private List<Long> recommendedProductsIds;

    // Date de creation du plan de repas.
    private LocalDateTime createdAt;

    // Methode appelee automatiquement par JPA avant l'insertion en base.
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // Expose uniquement l'id du profil dans la reponse API sans serialiser tout l'objet NutritionProfile.
    public Long getNutritionProfileId() {
        return nutritionProfile != null ? nutritionProfile.getId() : null;
    }

    // Valeurs possibles pour le type de repas.
    public enum MealType {
        BREAKFAST, LUNCH, DINNER, SNACK
    }
}
