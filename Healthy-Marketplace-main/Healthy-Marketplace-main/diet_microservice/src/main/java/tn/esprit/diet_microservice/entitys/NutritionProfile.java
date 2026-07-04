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
// Entite JPA qui represente les informations nutritionnelles d'un utilisateur.
public class NutritionProfile {

    // Cle primaire auto-generee par la base de donnees.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Identifiant de l'utilisateur provenant d'un autre microservice ou du systeme d'authentification.
    private String userId;

    // Donnees physiques et informations necessaires au calcul des besoins nutritionnels.
    private Double weight;
    private Double height;
    private Integer age;
    private String gender;
    private String activityLevel;

    // Objectif nutritionnel stocke sous forme de texte en base grace a EnumType.STRING.
    @Enumerated(EnumType.STRING)
    private Goal goal;

    // Cibles nutritionnelles journalieres calculees ou renseignees par le client.
    private Double dailyCalories;
    private Double proteinTarget;
    private Double carbTarget;
    private Double fatTarget;

    // Un profil peut posseder plusieurs plans de repas.
    // cascade = ALL propage les operations aux MealPlan, orphanRemoval supprime les plans retires.
    @OneToMany(mappedBy = "nutritionProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<MealPlan> mealPlans;

    // Valeurs possibles pour l'objectif du profil.
    public enum Goal {
        LOSE_WEIGHT, GAIN_WEIGHT, MAINTAIN
    }
}
