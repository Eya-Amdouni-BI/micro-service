import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { OrderResponse } from '../../models/order.model';
import { OrderService } from '../../services/order.service';


@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],  // ← this fixes ALL the errors
})
export class MyOrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading = true;
  error = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.orderService.getByUserId(userId).subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load orders. Please try again.';
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'delivered':  return 'bg-green-100 text-green-700';
      case 'pending':    return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':  return 'bg-red-100 text-red-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      default:           return 'bg-gray-100 text-gray-700';
    }
  }

  getPaymentStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'paid':    return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed':  return 'text-red-600';
      default:        return 'text-gray-600';
    }
  }
}