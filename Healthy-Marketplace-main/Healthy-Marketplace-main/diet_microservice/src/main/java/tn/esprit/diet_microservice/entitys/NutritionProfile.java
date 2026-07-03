package tn.esprit.diet_microservice.entitys;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private Double weight;
    private Double height;
    private Integer age;
    private String gender;
    private String activityLevel;

    // ENUM: lose_weight / gain_weight / maintain
    @Enumerated(EnumType.STRING)
    private Goal goal;

    private Double dailyCalories;
    private Double proteinTarget;
    private Double carbTarget;
    private Double fatTarget;

    @OneToMany(mappedBy = "nutritionProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<MealPlan> mealPlans;

    public enum Goal {
        LOSE_WEIGHT, GAIN_WEIGHT, MAINTAIN
    }
}