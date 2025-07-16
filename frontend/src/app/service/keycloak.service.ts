import Keycloak from 'keycloak-js';
import { environment } from '../../environments/environment';

export class KeycloakService {

  private keycloakUrl = `${environment.keycloakUrl}`;

  private keycloak = new Keycloak({
    url: this.keycloakUrl,
    realm: 'ofk-micro',
    clientId: 'frontend-client',
  });

  private authenticated = false;
  private initialized = false;


  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/assets/silent-check-sso.html`,
        checkLoginIframe: false,
      });

      this.authenticated = authenticated;
      this.initialized = true;
      console.log('Keycloak initialized:', authenticated);
    } catch (error) {
      console.error('Keycloak init failed:', error);
    }
  }

  register(): void {
    this.keycloak.register({
      redirectUri: window.location.origin
    });
  }

  login(): void {
    this.keycloak.login({ redirectUri: window.location.origin });
  }

  logout(): void {
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  isLoggedIn(): boolean {
    return this.authenticated;
  }

  getUsername(): string {
    return this.keycloak.tokenParsed?.['preferred_username'] ?? '';
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  async getValidToken(): Promise<string | null> {
    try {
      await this.keycloak.updateToken(30); // refresh if expires in < 30s
      return this.keycloak.token ?? null;
    } catch (err) {
      console.error('Failed to refresh token', err);
      return null;
    }
  }

}
