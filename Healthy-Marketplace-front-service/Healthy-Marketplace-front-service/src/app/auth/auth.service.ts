import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private keycloak: KeycloakService) {}

  getToken(): Promise<string> {
    return this.keycloak.getToken();
  }

  async getUserProfile() {
    return this.keycloak.loadUserProfile();
  }

  getUserId(): string {
    const profile = this.keycloak.getKeycloakInstance()?.tokenParsed;
    return profile?.['sub'] ?? '';
  }

  getUsername(): string {
    return this.keycloak.getUsername();
  }

  async isLoggedIn(): Promise<boolean> {
    return this.keycloak.isLoggedIn();
  }

  logout(): void {
    this.keycloak.logout('http://localhost:4200');
  }
  isAdmin():boolean {
 return this.keycloak.isUserInRole('admin');
  }
}