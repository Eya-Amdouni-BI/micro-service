package tn.esprit.orderservice.controllers;



import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.orderservice.entities.Payment;
import tn.esprit.orderservice.services.OrderEventPublisher;
import tn.esprit.orderservice.services.PaymentService;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin("*")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderEventPublisher orderEventPublisher;

    public PaymentController(PaymentService paymentService, OrderEventPublisher orderEventPublisher) {
        this.paymentService = paymentService;
        this.orderEventPublisher = orderEventPublisher;
    }

    @GetMapping
    public List<Payment> getAll() {
        return paymentService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getOne(@PathVariable Long id) {
        return paymentService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getByOrder(@PathVariable Long orderId) {
        return paymentService.findByOrderId(orderId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Payment create(@RequestBody Payment payment) {
        Payment savedPayment = paymentService.save(payment);
        if (savedPayment.getPaymentStatus() != null && savedPayment.getPaymentStatus().equalsIgnoreCase("CONFIRMED")
                && savedPayment.getOrder() != null) {
            orderEventPublisher.publishPaymentConfirmed(savedPayment.getOrder());
        }
        return savedPayment;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> update(@PathVariable Long id, @RequestBody Payment payment) {
        return paymentService.findById(id)
                .map(existing -> {
                    existing.setAmount(payment.getAmount());
                    existing.setMethod(payment.getMethod());
                    existing.setPaymentStatus(payment.getPaymentStatus());
                    existing.setPaymentDate(payment.getPaymentDate());
                    if (payment.getOrder() != null) {
                        existing.setOrder(payment.getOrder());
                    }
                    Payment savedPayment = paymentService.save(existing);
                    if (savedPayment.getPaymentStatus() != null && savedPayment.getPaymentStatus().equalsIgnoreCase("CONFIRMED")
                            && savedPayment.getOrder() != null) {
                        orderEventPublisher.publishPaymentConfirmed(savedPayment.getOrder());
                    }
                    return ResponseEntity.ok(savedPayment);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (paymentService.findById(id).isPresent()) {
            paymentService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}