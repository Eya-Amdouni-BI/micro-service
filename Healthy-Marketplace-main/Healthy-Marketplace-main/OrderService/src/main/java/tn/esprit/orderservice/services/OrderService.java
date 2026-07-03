package tn.esprit.orderservice.services;



import org.springframework.stereotype.Service;
import tn.esprit.orderservice.entities.Order;
import tn.esprit.orderservice.repositories.OrderRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import tn.esprit.orderservice.entities.Order;
import tn.esprit.orderservice.entities.Payment;
import tn.esprit.orderservice.repositories.OrderRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> findByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public Order save(Order order) {
        if (order.getCreatedAt() == null) {
            order.setCreatedAt(LocalDateTime.now());
        }

        if (order.getPayment() != null) {
            // Critical: Link back to the order
            order.getPayment().setOrder(order);

            if (order.getPayment().getPaymentDate() == null) {
                order.getPayment().setPaymentDate(LocalDateTime.now());
            }

            if (order.getId() != null) {
                Optional<Order> existingOpt = orderRepository.findById(order.getId());
                if (existingOpt.isPresent()) {
                    Order existing = existingOpt.get();
                    if (existing.getPayment() != null && order.getPayment().getId() == null) {
                        Payment existingPayment = existing.getPayment();
                        existingPayment.setAmount(order.getPayment().getAmount());
                        existingPayment.setMethod(order.getPayment().getMethod());
                        existingPayment.setPaymentStatus(order.getPayment().getPaymentStatus());
                        existingPayment.setPaymentDate(order.getPayment().getPaymentDate() != null
                                ? order.getPayment().getPaymentDate()
                                : LocalDateTime.now());

                        order.setPayment(existingPayment);
                    }
                }
            }
        }

        return orderRepository.save(order);
    }

    public void deleteById(Long id) {
        orderRepository.deleteById(id);
    }
}