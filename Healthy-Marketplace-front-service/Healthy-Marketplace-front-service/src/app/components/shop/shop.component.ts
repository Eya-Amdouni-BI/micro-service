import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, Category } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

interface CartItem extends Product { quantity: number; }

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  products: Product[]  = [];
  categories: Category[] = [];
  loading  = false;
  error    = '';

  // ─── Filters ──────────────────────────────────────────────
  selectedCategoryId: number | null = null;
  priceMax    = 100;
  sortBy      = 'default';
  searchQuery = '';
  currentPage = 1;
  pageSize    = 9;

  // ─── Cart ─────────────────────────────────────────────────
  cart: CartItem[] = [];
  cartOpen = false;
  toast    = '';

  constructor(private productService: ProductService, private router: Router) {
    const saved = localStorage.getItem('cart');
    if (saved) this.cart = JSON.parse(saved);
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  // ─── Data loading ─────────────────────────────────────────
  loadProducts(): void {
    this.loading = true;
    this.error = '';
    this.productService.getAllProducts().subscribe({
      next:  p => { this.products = p; this.loading = false; },
      error: () => { this.error = 'Could not load products.'; this.loading = false; }
    });
  }

  loadCategories(): void {
    this.productService.getAllCategories().subscribe({
      next:  c => this.categories = c,
      error: () => {}
    });
  }

  // ─── Filtering / sorting / pagination ─────────────────────
  get filtered(): Product[] {
    let list = [...this.products];

    if (this.selectedCategoryId !== null)
      list = list.filter(p => p.category?.id === this.selectedCategoryId);

    list = list.filter(p => p.price <= this.priceMax);

    if (this.searchQuery.trim())
      list = list.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(this.searchQuery.toLowerCase())
      );

    switch (this.sortBy) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return list;
  }

  get paginated(): Product[] {
    const s = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(s, s + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  selectCategory(id: number | null): void {
    this.selectedCategoryId = id;
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.selectedCategoryId = null;
    this.priceMax    = 100;
    this.searchQuery = '';
    this.sortBy      = 'default';
    this.currentPage = 1;
  }

  goPage(p: number): void {
    this.currentPage = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── Cart ─────────────────────────────────────────────────
  addToCart(product: Product): void {
    if (product.stock === 0) return;
    const existing = this.cart.find(c => c.id === product.id);
    if (existing) existing.quantity++;
    else this.cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.showToast(`${product.name} added to cart`);
  }

  removeFromCart(id: number): void {
    this.cart = this.cart.filter(c => c.id !== id);
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  get cartCount(): number {
    return this.cart.reduce((s, c) => s + c.quantity, 0);
  }

  get cartTotal(): number {
    return this.cart.reduce((s, c) => s + c.price * c.quantity, 0);
  }

  showToast(msg: string): void {
    this.toast = msg;
    setTimeout(() => this.toast = '', 2800);
  }

  // ─── Navigate to detail ───────────────────────────────────
  openDetail(id: number): void {
    this.router.navigate(['/shop', id]);
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }
}
