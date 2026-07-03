import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  id?: number;
  content: string;
  rating: number;
  productId: number;
  userId?: number;
  createdAt?: string;
}

export interface Report {
  id?: number;
  reason: string;
  contentId: number;
  contentType: 'REVIEW' | 'PRODUCT' | 'COMMENT' | 'FORUM_POST';
  reporterId?: number;
  status?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewReportService {
  private apiUrl = 'http://localhost:8888/REVIEWREPORTSERVICE/api';

  constructor(private http: HttpClient) { }

  // Review Endpoints
  getReviewsByProduct(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews/product/${productId}`);
  }

  addReview(review: Review): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reviews`, review);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reviews/${id}`);
  }

  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews`);
  }

  // Report Endpoints
  reportContent(report: Report): Observable<Report> {
    return this.http.post<Report>(`${this.apiUrl}/reports`, report);
  }

  getAllReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/reports`);
  }

  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reports/${id}`);
  }
}
