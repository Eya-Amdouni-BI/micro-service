import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { OrderResponse, OrderRequest } from '../../models/order.model';
import { Product, Category, ProductRequest, CategoryRequest } from '../../models/product.model';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { ReviewReportService, Review, Report } from '../../services/review-report.service';
import { DeliveryService } from '../../services/delivery.service';
import { SidenavComponent, AdminSection } from '../sidenav/sidenav.component';
import { OrdersByStatusPipe, LowStockPipe, ProductsByCategoryPipe, CountPipe } from '../../pipes/admin.pipes';

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  categories: number;
  reports: number;
  reviews: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidenavComponent, OrdersByStatusPipe, LowStockPipe, ProductsByCategoryPipe, CountPipe],
  templateUrl: './dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {

  // ── Layout ──────────────────────────────────────────────────
  activeSection: AdminSection = 'dashboard';
  loading = false;
  username = '';
  userId = '';

  // ── Stats ────────────────────────────────────────────────────
  stats: Stats = {
    totalProducts: 0, totalOrders: 0,
    totalRevenue: 0, pendingOrders: 0,
    completedOrders: 0, categories: 0,
    reports: 0, reviews: 0
  };

  // ── Data ─────────────────────────────────────────────────────
  products: Product[] = [];
  orders: OrderResponse[] = [];
  categories: Category[] = [];
  reviews: Review[] = [];
  reports: Report[] = [];

  // ── Search / filter ──────────────────────────────────────────
  productSearch = '';
  orderSearch = '';
  categorySearch = '';
  reportSearch = '';
  reviewSearch = '';
  orderStatusFilter = '';

  // ─── Confirm Delete ──────────────────────────────────────────
  confirmDelete: { type: 'product' | 'order' | 'category' | 'report' | 'review'; id: number; name: string } | null = null;

  // ─── Notification ────────────────────────────────────────────
  toast: { message: string; type: 'success' | 'error' } | null = null;

  // ─── Modals ──────────────────────────────────────────────────
  showProductModal = false;
  editingProduct: Product | null = null;
  productForm: any = { name: '', description: '', price: 0, stock: 0, category: { id: 0 } };

  showCategoryModal = false;
  editingCategory: Category | null = null;
  categoryForm: any = { name: '', description: '' };

  showOrderModal = false;
  editingOrder: OrderResponse | null = null;
  orderForm: any = {
    userId: '',
    totalPrice: 0,
    status: 'PENDING',
    createdAt: '',
    payment: { amount: 0, method: 'CARD', paymentStatus: 'PENDING', paymentDate: '' },
    delivery: { address: '', clientName: '', driverName: '' }
  };

  readonly orderStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  readonly paymentMethods = ['CARD', 'PAYPAL', 'APPLEPAY', 'CASH'];
  readonly paymentStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];

  constructor(
    private auth: AuthService,
    private productSvc: ProductService,
    private orderSvc: OrderService,
    private reviewReportSvc: ReviewReportService,
    private deliverySvc: DeliveryService
  ) {}

  ngOnInit(): void {
    this.username = this.auth.getUsername();
    this.userId = this.auth.getUserId();
    this.loadAll();
  }

  // ─── Load all data ────────────────────────────────────────────
  loadAll(): void {
    this.loading = true;
    forkJoin({
      products: this.productSvc.getAllProducts(),
      orders: this.orderSvc.getAll(),
      categories: this.productSvc.getAllCategories(),
      reports: this.reviewReportSvc.getAllReports(),
      reviews: this.reviewReportSvc.getAllReviews()
    }).subscribe({
      next: ({ products, orders, categories, reports, reviews }) => {
        this.products = products;
        this.orders = orders;
        this.categories = categories;
        this.reports = reports;
        this.reviews = reviews;
        this.computeStats();
        this.loading = false;
      },
      error: () => {
        this.showToast('Failed to load data', 'error');
        this.loading = false;
      }
    });
  }

  computeStats(): void {
    this.stats = {
      totalProducts: this.products.length,
      totalOrders: this.orders.length,
      totalRevenue: this.orders.reduce((s, o) => s + o.totalPrice, 0),
      pendingOrders: this.orders.filter(o => o.status === 'PENDING').length,
      completedOrders: this.orders.filter(o => o.status === 'DELIVERED').length,
      categories: this.categories.length,
      reports: this.reports.length,
      reviews: this.reviews.length
    };
  }

  // ─── Filtered lists ───────────────────────────────────────────
  get filteredProducts(): Product[] {
    const q = this.productSearch.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category?.name.toLowerCase().includes(q)
    );
  }

  get filteredOrders(): OrderResponse[] {
    const q = this.orderSearch.toLowerCase();
    return this.orders.filter(o => {
      const matchQ = o.id.toString().includes(q) || o.userId.toLowerCase().includes(q);
      const matchStatus = this.orderStatusFilter ? o.status === this.orderStatusFilter : true;
      return matchQ && matchStatus;
    });
  }

  get filteredCategories(): Category[] {
    const q = this.categorySearch.toLowerCase();
    return this.categories.filter(c => c.name.toLowerCase().includes(q));
  }

  get filteredReports(): Report[] {
    const q = this.reportSearch.toLowerCase();
    return this.reports.filter(r => r.reason.toLowerCase().includes(q) || r.status?.toLowerCase().includes(q));
  }

  get filteredReviews(): Review[] {
    const q = this.reviewSearch.toLowerCase();
    return this.reviews.filter(r => r.content.toLowerCase().includes(q));
  }

  // ─────────────────────────────────────────────────────────────
  // PRODUCT CRUD
  // ─────────────────────────────────────────────────────────────
  openAddProduct(): void {
    this.editingProduct = null;
    this.productForm = { name: '', description: '', price: 0, stock: 0, category: { id: this.categories[0]?.id || 0 } };
    this.showProductModal = true;
  }

  openEditProduct(p: Product): void {
    this.editingProduct = p;
    this.productForm = {
      name: p.name,
      description: p.description || '',
      price: p.price,
      stock: p.stock,
      category: { id: p.category?.id || 0 }
    };
    this.showProductModal = true;
  }

  saveProduct(): void {
    if (!this.productForm.name || !this.productForm.category?.id) return;
    const req$ = this.editingProduct
      ? this.productSvc.updateProduct(this.editingProduct.id, this.productForm)
      : this.productSvc.createProduct(this.productForm);

    req$.subscribe({
      next: () => {
        this.showToast(this.editingProduct ? 'Product updated' : 'Product created', 'success');
        this.showProductModal = false;
        this.loadAll();
      },
      error: () => this.showToast('Failed to save product', 'error')
    });
  }

  confirmDeleteProduct(p: Product): void {
    this.confirmDelete = { type: 'product', id: p.id, name: p.name };
  }

  // ─────────────────────────────────────────────────────────────
  // ORDER CRUD
  // ─────────────────────────────────────────────────────────────
  openAddOrder(): void {
    this.editingOrder = null;
    const now = new Date().toISOString().slice(0, 19);
    this.orderForm = {
      userId: this.userId,
      totalPrice: 0,
      status: 'PENDING',
      createdAt: now,
      payment: { amount: 0, method: 'CARD', paymentStatus: 'PENDING', paymentDate: now },
      delivery: { address: '', clientName: '', driverName: '' }
    };
    this.showOrderModal = true;
  }

  openEditOrder(o: OrderResponse): void {
    this.editingOrder = o;
    this.orderForm = {
      userId: o.userId,
      totalPrice: o.totalPrice,
      status: o.status,
      createdAt: o.createdAt,
      payment: {
        amount: o.payment?.amount || 0,
        method: o.payment?.method || 'CARD',
        paymentStatus: o.payment?.paymentStatus || 'PENDING',
        paymentDate: o.payment?.paymentDate || new Date().toISOString().slice(0, 19)
      },
      delivery: { address: '', clientName: o.userId, driverName: '' }
    };
    this.showOrderModal = true;
  }

  saveOrder(): void {
    const isNew = !this.editingOrder;
    const req$ = isNew
      ? this.orderSvc.placeOrder(this.orderForm)
      : this.orderSvc.updateOrder(this.editingOrder!.id, this.orderForm);

    req$.subscribe({
      next: (savedOrder) => {
        // Sync with Delivery Service if Shipped/Delivered
        if (!isNew && this.orderForm.delivery.address && (this.orderForm.status === 'SHIPPED' || this.orderForm.status === 'DELIVERED')) {
           const deliveryPayload = {
             orderId: savedOrder.id.toString(),
             clientName: this.orderForm.delivery.clientName || savedOrder.userId,
             deliveryAddress: this.orderForm.delivery.address,
             driverName: this.orderForm.delivery.driverName || 'External Driver',
             status: (this.orderForm.status === 'DELIVERED' ? 'Delivered' : 'Shipped') as any
           };
           this.deliverySvc.createDelivery(deliveryPayload).subscribe({
              next: () => this.showToast('Order and Delivery Tracking synced!', 'success'),
              error: () => this.showToast('Order saved, but Delivery tracking already established or failed', 'success')
           });
        } else {
           this.showToast(this.editingOrder ? 'Order updated' : 'Order created', 'success');
        }

        this.showOrderModal = false;
        this.loadAll();
      },
      error: () => this.showToast('Failed to save order', 'error')
    });
  }

  confirmDeleteOrder(o: OrderResponse): void {
    this.confirmDelete = { type: 'order', id: o.id, name: `Order #${o.id}` };
  }

  // ─────────────────────────────────────────────────────────────
  // CATEGORY CRUD
  // ─────────────────────────────────────────────────────────────
  openAddCategory(): void {
    this.editingCategory = null;
    this.categoryForm = { name: '', description: '' };
    this.showCategoryModal = true;
  }

  openEditCategory(c: Category): void {
    this.editingCategory = c;
    this.categoryForm = { name: c.name, description: c.description || '' };
    this.showCategoryModal = true;
  }

  saveCategory(): void {
    if (!this.categoryForm.name) return;
    const req$ = this.editingCategory
      ? this.productSvc.updateCategory(this.editingCategory.id, this.categoryForm)
      : this.productSvc.createCategory(this.categoryForm);

    req$.subscribe({
      next: () => {
        this.showToast(this.editingCategory ? 'Category updated' : 'Category created', 'success');
        this.showCategoryModal = false;
        this.loadAll();
      },
      error: () => this.showToast('Failed to save category', 'error')
    });
  }

  confirmDeleteCategory(c: Category): void {
    this.confirmDelete = { type: 'category', id: c.id, name: c.name };
  }

  confirmDeleteReport(r: Report): void {
    this.confirmDelete = { type: 'report', id: r.id!, name: `Report #${r.id}` };
  }

  confirmDeleteReview(r: Review): void {
    this.confirmDelete = { type: 'review', id: r.id!, name: `Review #${r.id}` };
  }

  // ─────────────────────────────────────────────────────────────
  // SHARED DELETE
  // ─────────────────────────────────────────────────────────────
  executeDelete(): void {
    if (!this.confirmDelete) return;
    const { type, id } = this.confirmDelete;

    const req$ =
      type === 'product'  ? this.productSvc.deleteProduct(id)  :
      type === 'order'    ? this.orderSvc.deleteOrder(id)       :
      type === 'category' ? this.productSvc.deleteCategory(id)  :
      type === 'report'   ? this.reviewReportSvc.deleteReport(id) :
      this.reviewReportSvc.deleteReview(id);

    req$.subscribe({
      next: () => {
        this.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`, 'success');
        this.confirmDelete = null;
        this.loadAll();
      },
      error: () => this.showToast('Failed to delete', 'error')
    });
  }

  // ─────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────
  showToast(message: string, type: 'success' | 'error'): void {
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3500);
  }

  statusColor(status: string): string {
    const map: Record<string, string> = {
      PENDING:   'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      CONFIRMED: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      SHIPPED:   'bg-violet-500/10 text-violet-400 border border-violet-500/20',
      DELIVERED: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20',
    };
    return map[status] ?? 'bg-gray-500/10 text-gray-400';
  }

  paymentColor(status: string): string {
    const map: Record<string, string> = {
      COMPLETED: 'text-emerald-400',
      PENDING:   'text-amber-400',
      FAILED:    'text-red-400',
      REFUNDED:  'text-violet-400',
    };
    return map[status] ?? 'text-gray-400';
  }

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  }

  formatDate(dt: string): string {
    return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  get greeting(): string {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  }
}