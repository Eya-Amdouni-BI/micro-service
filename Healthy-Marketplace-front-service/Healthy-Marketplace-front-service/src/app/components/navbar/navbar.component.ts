import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Product } from '../../models/product.model';
interface CartItem extends Product { quantity: number; }

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})

export class NavbarComponent implements OnInit {
  isScrolled = false;
  mobileMenuOpen = false;
  profileDropdownOpen = false;
  username? = '';

  menuItems = [
    { path: '/', label: 'Home', fragment: 'hero' },
    { path: '/shop', label: 'Shop', fragment: 'products' },
    { path: '/nutrition-profile', label: 'Nutrition', fragment: 'benefits' },
    { path: '/meal-plans', label: 'Meal Plans', fragment: 'meal-plans' },
    { path: '/about', label: 'About', fragment: 'benefits' },
    { path: '/forum', label: 'Forum' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/logs', label: 'Logs' },
    { path: '/delivery', label: 'Delivery' }
  ];
cartItemCount: any;

  cartItems: CartItem[] = [];


  loadCart(): void {
    const saved = localStorage.getItem('cart');
    this.cartItems = saved ? JSON.parse(saved) : [];
    this.cartItemCount = this.cartItems.reduce((s, i) => s + i.quantity, 0);
  }
  constructor(private authService: AuthService, private router: Router) {}

async ngOnInit(): Promise<void> {
    if (await this.authService.isLoggedIn()) {
      const profile = await this.authService.getUserProfile();
      this.username = profile.username;
      console.log('Logged in username:', this.username);
    }
        this.loadCart();

  }


  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleProfileDropdown() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  closeProfileDropdown() {
    this.profileDropdownOpen = false;
  }

  logout() {
    this.authService.logout();
  }

  navigate(item: any, event?: MouseEvent) {
    const currentPath = this.router.url.split('?')[0];
    if (item.fragment && currentPath === '/') {
      // when on home route, scroll to the fragment instead of navigating
      event?.preventDefault();
      const el = document.getElementById(item.fragment);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.mobileMenuOpen = false;
        return;
      }
    }

    // fallback: navigate normally
    this.mobileMenuOpen = false;
    this.router.navigateByUrl(item.path).catch(() => {});
  }
}