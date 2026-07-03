import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class AuthRedirectService {

  constructor(
    private keycloak: KeycloakService,
    private router: Router
  ) {
    // Listen to successful authentication
    this.keycloak.getKeycloakInstance().onAuthSuccess = () => {
      this.handlePostLoginRedirect();
    };
  }

  private async handlePostLoginRedirect() {
    const isLoggedIn = await this.keycloak.isLoggedIn();

    if (!isLoggedIn) return;

    const isAdmin = this.keycloak.isUserInRole('admin');   


    if (isAdmin) {
      this.router.navigate(['/admin']);        
    } else {
      this.router.navigate(['/shop']);             
    }
  }
}