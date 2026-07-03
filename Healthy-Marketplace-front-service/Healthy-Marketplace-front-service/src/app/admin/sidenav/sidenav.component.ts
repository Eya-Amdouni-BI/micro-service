import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
export type AdminSection = 'dashboard' | 'products' | 'orders' | 'categories' | 'reviews' | 'reports';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent implements OnInit {
  @Input() activeSection: AdminSection = 'dashboard';
  @Output() navigate = new EventEmitter<AdminSection>();

  username = '';
  collapsed = false;

  navItems = [
    {
      id: 'dashboard' as AdminSection,
      label: 'Dashboard',
      badge: null,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>`
    },
    {
      id: 'products' as AdminSection,
      label: 'Products',
      badge: null,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>`
    },
    {
      id: 'orders' as AdminSection,
      label: 'Orders',
      badge: null,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>`
    },
    {
      id: 'categories' as AdminSection,
      label: 'Categories',
      badge: null,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>`
    },
    {
      id: 'reviews' as AdminSection,
      label: 'Reviews',
      badge: null,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>`
    },
    {
      id: 'reports' as AdminSection,
      label: 'Reports',
      badge: null,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`
    }
  ];

  constructor(private auth: AuthService) {}

async ngOnInit(): Promise<void> {
  try {
    const isLoggedIn = await this.auth.isLoggedIn();
    if (!isLoggedIn) {
      // Optional: redirect to login or show message
      this.auth.logout(); // or handle unauthenticated state
      return;
    }

    // Load profile explicitly if needed
    await this.auth.getUserProfile();   // ← This is the key line

    this.username = this.auth.getUsername();

  } catch (err) {
    console.error('Auth initialization failed', err);
    // Handle error (e.g. redirect to login)
  }
}

  goTo(section: AdminSection): void {
    this.navigate.emit(section);
  }

  toggle(): void {
    this.collapsed = !this.collapsed;
  }

  logout(): void {
    this.auth.logout();
  }

  get initials(): string {
    return this.username ? this.username.slice(0, 2).toUpperCase() : 'AD';
  }
}