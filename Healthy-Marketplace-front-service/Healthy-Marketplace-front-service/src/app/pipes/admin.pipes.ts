import { Pipe, PipeTransform } from '@angular/core';
import { OrderResponse } from '../models/order.model';
import { Product } from '../models/product.model';

@Pipe({ name: 'ordersByStatus', standalone: true, pure: false })
export class OrdersByStatusPipe implements PipeTransform {
  transform(orders: OrderResponse[], status: string): OrderResponse[] {
    return orders.filter(o => o.status === status);
  }
}

@Pipe({ name: 'lowStock', standalone: true, pure: false })
export class LowStockPipe implements PipeTransform {
  transform(products: Product[], threshold = 10): Product[] {
    return products.filter(p => p.stock <= threshold).sort((a, b) => a.stock - b.stock);
  }
}

@Pipe({ name: 'productsByCategory', standalone: true, pure: false })
export class ProductsByCategoryPipe implements PipeTransform {
  transform(products: Product[], categoryId: number): Product[] {
    return products.filter(p => p.category?.id === categoryId);
  }
}

@Pipe({ name: 'count', standalone: true, pure: false })
export class CountPipe implements PipeTransform {
  transform(arr: any[]): number {
    return arr?.length ?? 0;
  }
}