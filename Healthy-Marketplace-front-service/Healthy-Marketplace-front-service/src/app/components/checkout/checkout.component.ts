import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderRequest } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../auth/auth.service';
import { Product } from '../../models/product.model';

interface CartItem extends Product { quantity: number; }

type PaymentMethod = 'CARD' | 'PAYPAL' | 'APPLEPAY';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  currentStep = 0;
  steps = ['Cart', 'Payment', 'Confirm'];

  // ─── Cart — loaded from localStorage ─────────────────────
  cartItems: CartItem[] = [];

  // ─── Payment ─────────────────────────────────────────────
  selectedMethod: PaymentMethod = 'CARD';
  cardNumber = '';
  cardName   = '';
  expiry     = '';
  cvv        = '';

  paymentMethods: { id: PaymentMethod; label: string; icon: string }[] = [
    { id: 'CARD',     label: 'Card',      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'PAYPAL',   label: 'PayPal',    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'APPLEPAY', label: 'Apple Pay', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
  ];

  // ─── State ───────────────────────────────────────────────
  isProcessing = false;
  orderComplete = false;
  orderNumber   = '';
  errorMessage  = '';

  constructor(
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('cart');
    this.cartItems = saved ? JSON.parse(saved) : [];

    // If cart is empty redirect back
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  // ─── Totals ──────────────────────────────────────────────
  get subtotal(): number { return this.cartItems.reduce((s, i) => s + i.price * i.quantity, 0); }
  get tax(): number      { return this.subtotal * 0.1; }
  get total(): number    { return this.subtotal + this.tax; }
  get itemCount(): number { return this.cartItems.reduce((s, i) => s + i.quantity, 0); }

  // ─── Navigation ──────────────────────────────────────────
  next(): void {
    if (this.stepValid && this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  back(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get stepValid(): boolean {
    if (this.currentStep === 0) return this.cartItems.length > 0;
    if (this.currentStep === 1 && this.selectedMethod === 'CARD')
      return !!(this.cardNumber && this.cardName && this.expiry && this.cvv);
    return true;
  }

  // ─── Submit ──────────────────────────────────────────────
  private toLocalDateTime(): string {
    return new Date().toISOString().slice(0, 19);
  }

  placeOrder(): void {
    this.isProcessing = true;
    this.errorMessage = '';

    const payload: OrderRequest = {
      userId:     this.authService.getUserId(),
      totalPrice: this.total,
      status:     'PENDING',
      createdAt:  this.toLocalDateTime(),
      payment: {
        amount:        this.total,
        method:        this.selectedMethod,
        paymentStatus: 'COMPLETED',
        paymentDate:   this.toLocalDateTime(),
      }
    };

    this.orderService.placeOrder(payload).subscribe({
      next: (res) => {
        this.isProcessing = false;
        this.orderComplete = true;
        this.orderNumber = 'ORD-' + res.id;
        localStorage.removeItem('cart');
        setTimeout(() => this.router.navigate(['/']), 3000);
      },
      error: (err) => {
        this.isProcessing = false;
        this.errorMessage = 'Failed to place order. Please try again.';
        console.error(err);
      }
    });
  }

  // ─── Formatting ──────────────────────────────────────────
  formatCardNumber(): void {
    const raw = this.cardNumber.replace(/\D/g, '').slice(0, 16);
    this.cardNumber = raw.match(/.{1,4}/g)?.join(' ') ?? raw;
  }

  formatExpiry(): void {
    const raw = this.expiry.replace(/\D/g, '').slice(0, 4);
    this.expiry = raw.length >= 3 ? raw.slice(0, 2) + '/' + raw.slice(2) : raw;
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }
}