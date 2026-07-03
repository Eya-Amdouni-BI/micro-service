import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Delivery {
  _id?: string;
  orderId: string;
  clientName: string;
  deliveryAddress: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Out for Delivery' | 'Preparing';
  driverName?: string;
  estimatedDeliveryDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Tracking {
  _id?: string;
  deliveryId: string;
  status: string;
  location?: string;
  description?: string;
  timestamp?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = 'http://localhost:8888/api/v1/deliveries';

  constructor(private http: HttpClient) { }

  getAllDeliveries(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(this.apiUrl);
  }

  getDeliveryById(id: string): Observable<Delivery> {
    return this.http.get<Delivery>(`${this.apiUrl}/${id}`);
  }

  createDelivery(delivery: Partial<Delivery>): Observable<any> {
    return this.http.post(this.apiUrl, delivery);
  }

  updateDeliveryStatus(id: string, updateData: any): Observable<Delivery> {
    return this.http.put<Delivery>(`${this.apiUrl}/${id}/status`, updateData);
  }

  getTrackingHistory(deliveryId: string): Observable<Tracking[]> {
    return this.http.get<Tracking[]>(`${this.apiUrl}/${deliveryId}/tracking`);
  }

  deleteDelivery(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
