import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakService } from '../../service/keycloak.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  private keycloak = inject(KeycloakService);
  private router = inject(Router);

  isLoggedIn = false;
  username = '';

  async ngOnInit(): Promise<void> {
    await this.keycloak.init();
    this.updateLoginState();
  }

  register(): void {
    this.keycloak.register();
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout();
  }

  goToHome(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  goToProfile(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/profile']);
    }
  }

  private updateLoginState(): void {
    this.isLoggedIn = this.keycloak.isLoggedIn();
    this.username = this.keycloak.getUsername();
  }

}
