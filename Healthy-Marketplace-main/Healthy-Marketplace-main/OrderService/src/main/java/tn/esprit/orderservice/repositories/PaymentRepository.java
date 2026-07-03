package tn.esprit.orderservice.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.orderservice.entities.Payment;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(Long orderId);
}
