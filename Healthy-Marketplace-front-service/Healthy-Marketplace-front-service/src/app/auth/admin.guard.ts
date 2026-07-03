// src/app/guards/admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

export const adminGuard: CanActivateFn = async (route, state) => {
  const keycloak = inject(KeycloakService);
  const router = inject(Router);

  const isLoggedIn = await keycloak.isLoggedIn();

  if (!isLoggedIn) {
    await keycloak.login({ redirectUri: window.location.origin + state.url });
    return false;
  }

  // Check if user has the 'admin' role (realm role or client role)
  const hasAdminRole = keycloak.isUserInRole('admin');   // realm role

  // If it's a client role (recommended for apps), use:
  // const hasAdminRole = keycloak.isUserInRole('admin', 'your-client-id');

  if (hasAdminRole) {
    return true;
  }

  // Optional: redirect to unauthorized or home page
  router.navigate(['/unauthorized']);   // or ['/']
  return false;
};