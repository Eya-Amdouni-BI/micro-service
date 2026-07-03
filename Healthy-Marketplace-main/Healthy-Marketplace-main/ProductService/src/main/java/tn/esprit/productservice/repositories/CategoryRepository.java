package tn.esprit.productservice.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.productservice.entities.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
