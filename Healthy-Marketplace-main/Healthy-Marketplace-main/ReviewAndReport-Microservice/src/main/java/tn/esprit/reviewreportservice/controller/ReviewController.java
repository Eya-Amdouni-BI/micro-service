package tn.esprit.reviewreportservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.esprit.reviewreportservice.entity.Review;
import tn.esprit.reviewreportservice.service.ReviewService;
import tn.esprit.reviewreportservice.service.ServiceLogPublisher;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("*")
@Tag(name = "Review Management", description = "Endpoints for managing product and forum reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ServiceLogPublisher logPublisher;

    @Autowired
    private tn.esprit.reviewreportservice.client.ProductRestClient productRestClient;

    @PostMapping
    @Operation(summary = "Add a new review", description = "Creates a new review")
    public Review addReview(@RequestBody Review review) {
        Review saved = reviewService.addReview(review);
        Map<String, Object> meta = new HashMap<>();
        meta.put("reviewId", saved.getId());
        meta.put("productId", saved.getProductId());
        meta.put("userId", saved.getUserId());
        logPublisher.info("ReviewReportService", "Review created", meta);
        return saved;
    }

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get reviews by product ID", description = "Retrieves all reviews associated with a specific product")
    public List<Review> getReviewsByProduct(@PathVariable Long productId) {
        return reviewService.getReviewsByProduct(productId);
    }

    @GetMapping
    @Operation(summary = "Get all reviews", description = "Retrieves all reviews")
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    // test openfeign
    @GetMapping("/product/{productId}/details")
    @Operation(summary = "Get product details with reviews", description = "Retrieves product information from ProductService and its related reviews")
    public Object getProductDetailsWithReviews(@PathVariable Long productId) {
        tn.esprit.reviewreportservice.dto.ProductDTO product = null;
        try {
            product = productRestClient.getProductById(productId);
        } catch (feign.FeignException.NotFound e) {
        }

        List<Review> reviews = reviewService.getReviewsByProduct(productId);

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        if (product != null) {
            response.put("product", product);
        } else {
            response.put("product", "Product with ID " + productId + " not found in ProductService");
        }
        response.put("reviews", reviews);
        return response;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a review", description = "Deletes an existing review by its ID")
    public void deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
    }
}
