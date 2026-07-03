// service/NutritionProfileService.java
package tn.esprit.diet_microservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.diet_microservice.entitys.NutritionProfile;
import tn.esprit.diet_microservice.repository.NutritionProfileRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NutritionProfileService {

    private final NutritionProfileRepository repo;

    public List<NutritionProfile> getAll() {
        return repo.findAll();
    }

    public NutritionProfile getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("NutritionProfile not found with id: " + id));
    }

    public List<NutritionProfile> getByUserId(String userId) {
        return repo.findByUserId(userId);
    }

    public NutritionProfile create(NutritionProfile profile) {
        return repo.save(profile);
    }

    public NutritionProfile update(Long id, NutritionProfile updated) {
        NutritionProfile existing = getById(id);
        existing.setUserId(updated.getUserId());
        existing.setWeight(updated.getWeight());
        existing.setHeight(updated.getHeight());
        existing.setAge(updated.getAge());
        existing.setGender(updated.getGender());
        existing.setActivityLevel(updated.getActivityLevel());
        existing.setGoal(updated.getGoal());
        existing.setDailyCalories(updated.getDailyCalories());
        existing.setProteinTarget(updated.getProteinTarget());
        existing.setCarbTarget(updated.getCarbTarget());
        existing.setFatTarget(updated.getFatTarget());
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}