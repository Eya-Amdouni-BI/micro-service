package tn.esprit.orderservice.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.orderservice.entities.Order;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(String userId);
}
