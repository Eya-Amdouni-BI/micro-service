import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../../services/delivery.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html'
})
export class DeliveryComponent implements OnInit {
  deliveryOptions = [
    {
      icon: 'fas fa-bolt',
      name: 'Express Delivery',
      time: '1-2 hours',
      price: '$5.99'
    },
    {
      icon: 'fas fa-truck',
      name: 'Standard Delivery',
      time: '24-48 hours',
      price: '$2.99'
    },
    {
      icon: 'fas fa-calendar-check',
      name: 'Scheduled Delivery',
      time: 'Choose your day',
      price: 'FREE'
    }
  ];

  standardTimes = [
    { day: 'Monday - Friday', slot: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', slot: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', slot: 'Closed' }
  ];

  expressTimes = [
    { day: 'Monday - Friday', slot: '10:00 AM - 8:00 PM' },
    { day: 'Saturday', slot: '11:00 AM - 6:00 PM' },
    { day: 'Sunday', slot: '12:00 PM - 4:00 PM' }
  ];

  deliveryZones = [
    { name: 'Zone 1 - Downtown', time: '30-45 min', fee: '$2.99' },
    { name: 'Zone 2 - Suburbs', time: '45-60 min', fee: '$3.99' },
    { name: 'Zone 3 - Rural', time: '60-90 min', fee: '$4.99' }
  ];

  trackingNumber: string = '';
  trackingResult: any = null;
  deliveries: any[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private deliveryService: DeliveryService) { }

  ngOnInit(): void {
    this.loadAllDeliveries();
  }

  loadAllDeliveries(): void {
    this.loading = true;
    this.deliveryService.getAllDeliveries().subscribe({
      next: (data) => {
        this.deliveries = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load deliveries';
        this.loading = false;
        console.error(err);
      }
    });
  }

  trackOrder(): void {
    if (this.trackingNumber) {
      this.loading = true;
      this.error = null;
      this.deliveryService.getDeliveryById(this.trackingNumber).subscribe({
        next: (delivery) => {
          this.updateLocalDeliveryList(delivery);
          this.deliveryService.getTrackingHistory(delivery._id!).subscribe({
            next: (history) => {
              this.trackingResult = {
                ...delivery,
                updates: history.map(h => ({
                  time: h.timestamp,
                  description: h.description
                }))
              };
              this.loading = false;
              this.loadAllDeliveries();
            },
            error: (err) => {
              this.trackingResult = delivery; // Show delivery at least
              this.loading = false;
              this.loadAllDeliveries();
            }
          });
        },
        error: (err) => {
          this.error = 'Delivery not found or tracking number invalid';
          this.loading = false;
          this.trackingResult = null;
        }
      });
    }
  }

  private updateLocalDeliveryList(delivery: any): void {
    const index = this.deliveries.findIndex(d => d._id === delivery._id);
    if (index >= 0) {
      this.deliveries[index] = delivery;
    } else {
      this.deliveries.unshift(delivery);
    }
  }

  calculateDeliveryFee(zipCode: string): number {
    // Simulate delivery fee calculation based on zip code
    const zipPrefix = parseInt(zipCode.substring(0, 3));
    if (zipPrefix < 100) return 2.99;
    if (zipPrefix < 200) return 3.99;
    return 4.99;
  }

  getZoneColor(zone: string): string {
    const colors: { [key: string]: string } = {
      'Zone 1': 'bg-green-100 text-green-800',
      'Zone 2': 'bg-yellow-100 text-yellow-800',
      'Zone 3': 'bg-orange-100 text-orange-800'
    };
    return colors[zone.split(' - ')[0]] || 'bg-gray-100 text-gray-800';
  }

  scheduleDelivery(date: string, timeSlot: string): void {
    console.log(`Delivery scheduled for ${date} at ${timeSlot}`);
  }
}