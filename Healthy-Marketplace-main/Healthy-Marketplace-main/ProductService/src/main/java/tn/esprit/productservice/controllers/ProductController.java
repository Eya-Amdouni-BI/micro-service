package tn.esprit.productservice.controllers;



import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.productservice.entities.Product;
import tn.esprit.productservice.services.ProductService;
import tn.esprit.productservice.services.ServiceLogPublisher;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final ServiceLogPublisher logPublisher;

    public ProductController(ProductService productService, ServiceLogPublisher logPublisher) {
        this.productService = productService;
        this.logPublisher = logPublisher;
    }

    @GetMapping
    public List<Product> getAll() {
        return productService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getOne(@PathVariable Long id) {
        return productService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        Product saved = productService.save(product);
        Map<String, Object> meta = new HashMap<>();
        meta.put("productId", saved.getId());
        meta.put("name", saved.getName());
        logPublisher.info("ProductService", "Product created", meta);
        return saved;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product product) {
        return productService.findById(id)
                .map(existing -> {
                    existing.setName(product.getName());
                    existing.setDescription(product.getDescription());
                    existing.setPrice(product.getPrice());
                    existing.setStock(product.getStock());
                    existing.setCategory(product.getCategory());
                    Product saved = productService.save(existing);
                    Map<String, Object> meta = new HashMap<>();
                    meta.put("productId", saved.getId());
                    meta.put("name", saved.getName());
                    logPublisher.info("ProductService", "Product updated", meta);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (productService.findById(id).isPresent()) {
            productService.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
