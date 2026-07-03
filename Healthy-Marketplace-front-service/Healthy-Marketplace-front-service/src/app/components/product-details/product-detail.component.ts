import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

interface CartItem extends Product { quantity: number; }

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  product: Product | null = null;
  loading = false;
  error   = '';
  qty     = 1;
  toast   = '';

  cart: CartItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    const saved = localStorage.getItem('cart');
    if (saved) this.cart = JSON.parse(saved);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.router.navigate(['/shop']); return; }
    this.load(id);
  }

  load(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next:  p => { this.product = p; this.loading = false; },
      error: () => { this.error = 'Product not found.'; this.loading = false; }
    });
  }

  changeQty(delta: number): void {
    this.qty = Math.max(1, Math.min(this.qty + delta, this.product?.stock ?? 1));
  }

  addToCart(): void {
    if (!this.product || this.product.stock === 0) return;
    const existing = this.cart.find(c => c.id === this.product!.id);
    if (existing) existing.quantity += this.qty;
    else this.cart.push({ ...this.product, quantity: this.qty });
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.showToast(`${this.qty} × ${this.product.name} added to cart`);
  }

  get cartCount(): number { return this.cart.reduce((s,c)=>s+c.quantity,0); }

  showToast(msg: string): void {
    this.toast = msg;
    setTimeout(() => this.toast = '', 2800);
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }
}
