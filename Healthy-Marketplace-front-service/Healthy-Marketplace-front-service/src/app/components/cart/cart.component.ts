import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';

interface CartItem extends Product { quantity: number; }

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartItems: CartItem[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    const saved = localStorage.getItem('cart');
    this.cartItems = saved ? JSON.parse(saved) : [];
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  updateQuantity(item: CartItem, delta: number): void {
    const next = item.quantity + delta;
    if (next < 1) return;
    if (next > (item.stock ?? 99)) return;
    item.quantity = next;
    this.saveCart();
  }

  removeItem(item: CartItem): void {
    this.cartItems = this.cartItems.filter(c => c.id !== item.id);
    this.saveCart();
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCart();
  }

  // ─── Totals ──────────────────────────────────────────────
  get subtotal(): number {
    return this.cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  }
  get tax(): number      { return this.subtotal * 0.1; }
  get total(): number    { return this.subtotal + this.tax; }
  get itemCount(): number { return this.cartItems.reduce((s, i) => s + i.quantity, 0); }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }
}