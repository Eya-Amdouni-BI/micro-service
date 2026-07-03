package tn.esprit.diet_microservice.entitys;// entity/MealPlan.java

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
public class MealPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nutrition_profile_id")
    @ToString.Exclude
    @JsonIgnore
    private NutritionProfile nutritionProfile;

    @Enumerated(EnumType.STRING)
    private MealType mealType;

    private Double recommendedCalories;

    @ElementCollection
    private List<Long> recommendedProductsIds;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // Helper method to get ProfileId in API response
    public Long getNutritionProfileId() {
        return nutritionProfile != null ? nutritionProfile.getId() : null;
    }

    public enum MealType {
        BREAKFAST, LUNCH, DINNER, SNACK
    }
}