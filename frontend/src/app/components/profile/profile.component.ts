import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
import { KeycloakService } from '../../service/keycloak.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, HeaderComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private keycloak = inject(KeycloakService);
  private apiUrl = `${environment.apiUrl}`;

  profileForm: FormGroup;

  editing = false;
  userProfile: any;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      address: [''],
      country: [''],
      age: [null, [Validators.min(0)]],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.keycloak.init();
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const headersWithToken = await this.addToken();

    this.http.get<any>(`${this.apiUrl}/api/users/profile`, { headers: headersWithToken }).subscribe({
      next: (data) => {
        console.log('data ', data)
        this.userProfile = data;
        this.profileForm = this.fb.group({
          fullName: [data.fullName],
          address: [data.address],
          country: [data.country],
          age: [data.age]
        });
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
      }
    });
  }

  toggleEdit(): void {
    this.editing = !this.editing;
  }

  async addToken() {
    const token = await this.keycloak.getValidToken();
    if (!token) {
      alert('Authentication required');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return headers;
  }


  async submitProfile(): Promise<void> {
    if (this.profileForm.invalid) return;

    const headersWithToken = await this.addToken();

    this.http.post(`${this.apiUrl}/api/users/profile`, this.profileForm.value, { headers: headersWithToken })
      .subscribe({
        next: () => {
          this.editing = false;
          this.loadUserProfile();
        },
        error: () => alert('Error updating profile')
      });
  }
}

