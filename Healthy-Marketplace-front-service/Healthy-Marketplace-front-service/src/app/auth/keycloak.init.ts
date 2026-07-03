import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:9090',
        realm: 'healthy-market-realm',
        clientId: 'angular-app'  
      },
      initOptions: {
        onLoad: 'login-required',   
        checkLoginIframe: false,
        
      },
        loadUserProfileAtStartUp: true

    }
  );
}