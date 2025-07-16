import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { KeycloakService } from './app/service/keycloak.service';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

async function bootstrap() {
  const keycloakService = new KeycloakService();
  const authenticated = await keycloakService.init();
  console.log('Keycloak authenticated:', authenticated);

  // Optionally provide the KeycloakService via appConfig providers
  bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [
      ...appConfig.providers || [],
      { provide: KeycloakService, useValue: keycloakService },
      provideRouter(routes),
    ],
  }).catch((err) => console.error(err));
}

bootstrap();
