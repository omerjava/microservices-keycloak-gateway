import { HeaderComponent } from "../header/header.component";
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from "@angular/common";
import { KeycloakService } from "../../service/keycloak.service";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, CommonModule,
    ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private keycloak = inject(KeycloakService);
  private apiUrl = `${environment.apiUrl}`;

  postForm: FormGroup;
  posts: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
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

  async ngOnInit() {
    await this.keycloak.init();
    this.loadPosts();
  }

  async loadPosts() {
    const headersWithToken = await this.addToken();

    this.http.get<any[]>(`${this.apiUrl}pi/posts`, { headers: headersWithToken }).subscribe({
      next: (data) => this.posts = data,
      error: (err) => console.error('Failed to load posts', err)
    });
  }

  async submitPost() {
    const headersWithToken = await this.addToken();

    if (this.postForm.invalid) return;

    this.http.post<any>(`${this.apiUrl}/api/posts`, this.postForm.value, { headers: headersWithToken }).subscribe({
      next: (newPost) => {
        this.posts.push(newPost);
        this.postForm.reset();
      },
      error: (err) => console.error('Failed to create post', err)
    });
  }

}
