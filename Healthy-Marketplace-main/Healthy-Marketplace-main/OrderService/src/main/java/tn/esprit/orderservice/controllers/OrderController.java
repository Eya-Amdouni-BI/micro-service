package tn.esprit.orderservice.controllers;



import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.orderservice.entities.Order;
import tn.esprit.orderservice.entities.Payment;
import tn.esprit.orderservice.services.OrderEventPublisher;
import tn.esprit.orderservice.services.OrderService;
import tn.esprit.orderservice.services.ServiceLogPublisher;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final OrderEventPublisher orderEventPublisher;
    private final ServiceLogPublisher logPublisher;

    public OrderController(OrderService orderService, OrderEventPublisher orderEventPublisher, ServiceLogPublisher logPublisher) {
        this.orderService = orderService;
        this.orderEventPublisher = orderEventPublisher;
        this.logPublisher = logPublisher;
    }

    @GetMapping
    public List<Order> getAll() {
        return orderService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOne(@PathVariable Long id) {
        return orderService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Order> getByUser(@PathVariable String userId) {
        return orderService.findByUserId(userId);
    }

    @PostMapping
    public Order create(@RequestBody Order order) {
        Order saved = orderService.save(order);
        orderEventPublisher.publishOrderCreated(saved);

        Map<String, Object> meta = new HashMap<>();
        meta.put("orderId", saved.getId());
        meta.put("userId", saved.getUserId());
        meta.put("status", saved.getStatus());
        logPublisher.info("OrderService", "Order created and published order.created event", meta);

        return saved;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> update(@PathVariable Long id, @RequestBody Order incomingOrder) {
        return orderService.findById(id)
                .map(existing -> {
                    // Update simple fields on Order
                    existing.setUserId(incomingOrder.getUserId());
                    existing.setTotalPrice(incomingOrder.getTotalPrice());
                    existing.setStatus(incomingOrder.getStatus());
                    // Do NOT update createdAt

                    // Handle Payment safely - NEVER just set a new object
                    if (incomingOrder.getPayment() != null) {
                        Payment incomingPayment = incomingOrder.getPayment();

                        if (existing.getPayment() == null) {
                            // First time adding payment
                            Payment newPayment = new Payment();
                            newPayment.setOrder(existing);
                            existing.setPayment(newPayment);
                        }

                        Payment paymentToUpdate = existing.getPayment();

                        paymentToUpdate.setAmount(incomingPayment.getAmount());
                        paymentToUpdate.setMethod(incomingPayment.getMethod());
                        paymentToUpdate.setPaymentStatus(incomingPayment.getPaymentStatus());
                        if (incomingPayment.getPaymentDate() != null) {
                            paymentToUpdate.setPaymentDate(incomingPayment.getPaymentDate());
                        }
                    }

                    Order saved = orderService.save(existing);
                    orderEventPublisher.publishOrderUpdated(saved);

                    Map<String, Object> meta = new HashMap<>();
                    meta.put("orderId", saved.getId());
                    meta.put("userId", saved.getUserId());
                    meta.put("status", saved.getStatus());
                    logPublisher.info("OrderService", "Order updated and published order.updated event", meta);

                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (orderService.findById(id).isPresent()) {
            orderService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
