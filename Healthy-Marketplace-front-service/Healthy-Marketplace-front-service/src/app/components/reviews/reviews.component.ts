import { Component, OnInit, Input } from '@angular/core';
import { ReviewReportService, Review } from '../../services/review-report.service';

interface RatingBreakdown {
  stars: number;
  percentage: number;
  count: number;
}

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html'
})
export class ReviewsComponent implements OnInit {
  @Input() productId!: number;

  reviews: Review[] = [];
  
  // Rating System
  overallRating: number = 0;
  totalReviews: number = 0;
  
  ratingBreakdown: RatingBreakdown[] = [
    { stars: 5, percentage: 0, count: 0 },
    { stars: 4, percentage: 0, count: 0 },
    { stars: 3, percentage: 0, count: 0 },
    { stars: 2, percentage: 0, count: 0 },
    { stars: 1, percentage: 0, count: 0 }
  ];

  // Filters
  selectedRating: number = 0;
  selectedSort: string = 'most_recent';

  sortOptions = [
    { value: 'most_recent', label: 'Most Recent' },
    { value: 'highest_rating', label: 'Highest Rating' },
    { value: 'lowest_rating', label: 'Lowest Rating' }
  ];

  // Review Form
  hoverRating: number = 0;
  selectedRatingForForm: number = 0;
  reviewForm = {
    content: ''
  };

  statistics = {
    averageRating: 0,
    totalReviews: 0,
    recommendations: 0,
    fiveStarPercentage: 0,
    fourStarPercentage: 0,
    threeStarPercentage: 0,
    twoStarPercentage: 0,
    oneStarPercentage: 0
  };

  constructor(private reviewService: ReviewReportService) { }

  ngOnInit(): void {
    if (this.productId) {
      this.loadReviews();
    }
  }

  loadReviews(): void {
    this.reviewService.getReviewsByProduct(this.productId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.calculateStatistics();
      },
      error: (err) => console.error('Failed to load reviews', err)
    });
  }

  get filteredReviews(): Review[] {
    let filtered = [...this.reviews];

    if (this.selectedRating > 0) {
      filtered = filtered.filter(r => r.rating === this.selectedRating);
    }

    switch(this.selectedSort) {
      case 'highest_rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest_rating':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      default: // most_recent
        filtered.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        break;
    }

    return filtered;
  }

  calculateStatistics(): void {
    const total = this.reviews.length;
    this.totalReviews = total;
    this.statistics.totalReviews = total;
    if (total === 0) return;

    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.overallRating = Number((sum / total).toFixed(1));
    this.statistics.averageRating = this.overallRating;
    
    const recommendations = this.reviews.filter(r => r.rating >= 4).length;
    this.statistics.recommendations = Math.round((recommendations / total) * 100);

    for (let i = 1; i <= 5; i++) {
        const count = this.reviews.filter(r => r.rating === i).length;
        const breakdown = this.ratingBreakdown.find(b => b.stars === i);
        if (breakdown) {
            breakdown.count = count;
            breakdown.percentage = Math.round((count / total) * 100);
        }
    }
  }

  submitReview(): void {
    if (this.reviewForm.content && this.selectedRatingForForm > 0 && this.productId) {
      const newReview: Review = {
        rating: this.selectedRatingForForm,
        content: this.reviewForm.content,
        productId: this.productId,
        userId: 1 // Mock user ID since we don't have auth context integrated here yet
      };

      this.reviewService.addReview(newReview).subscribe({
        next: (review) => {
          this.reviews.unshift(review);
          this.calculateStatistics();
          
          this.reviewForm.content = '';
          this.selectedRatingForForm = 0;
          this.showNotification('Review submitted successfully!');
        },
        error: (err) => console.error('Failed to submit review', err)
      });
    }
  }

  getStarArray(rating: number): number[] {
    return [1, 2, 3, 4, 5];
  }

  isRatingFilled(star: number, rating: number): boolean {
    return star <= rating;
  }

  getRatingPercentage(rating: number): number {
    const breakdown = this.ratingBreakdown.find(r => r.stars === rating);
    return breakdown ? breakdown.percentage : 0;
  }

  getRatingCount(rating: number): number {
    const breakdown = this.ratingBreakdown.find(r => r.stars === rating);
    return breakdown ? breakdown.count : 0;
  }

  filterByRating(rating: number): void {
    this.selectedRating = rating;
  }

  clearFilters(): void {
    this.selectedRating = 0;
    this.selectedSort = 'most_recent';
  }

  showNotification(message: string): void {
    alert(message);
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  }

  getAvatarInitials(): string {
    return 'U';
  }

  reportReview(review: Review): void {
    this.reviewService.reportContent({
        contentId: review.id || 0,
        contentType: 'REVIEW',
        reason: 'Inappropriate content'
    }).subscribe({
        next: () => this.showNotification('Review reported to admins.'),
        error: () => this.showNotification('Failed to report review.')
    });
  }
}