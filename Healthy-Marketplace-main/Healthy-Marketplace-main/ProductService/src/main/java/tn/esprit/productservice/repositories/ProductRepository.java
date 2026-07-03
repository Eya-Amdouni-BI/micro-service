package tn.esprit.productservice.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.productservice.entities.Product;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
}
