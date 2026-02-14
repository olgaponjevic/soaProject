import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { UsersApiService } from '../../core/services/users-api.service';
import { AuthApiService } from '../../core/services/auth-api.service';
import { ProfileResponse } from '../../core/models/user.models';
import { IdentityService } from '../../core/services/identity.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <h2>Moj profil</h2>

  <div *ngIf="loading">Učitavanje...</div>
  <p class="err" *ngIf="error">{{error}}</p>

  <ng-container *ngIf="profile as p">
    <img *ngIf="p.profileImageUrl" [src]="p.profileImageUrl" width="120" height="120" style="object-fit:cover;border-radius:50%" />

    <p><b>Username:</b> {{p.username}}</p>
    <p><b>Email:</b> {{p.email}}</p>
    <p><b>Ime:</b> {{p.firstName || '-'}}</p>
    <p><b>Prezime:</b> {{p.lastName || '-'}}</p>
    <p><b>Bio:</b> {{p.biography || '-'}}</p>
    <p><b>Moto:</b> {{p.motto || '-'}}</p>

    <a routerLink="/profile/edit">Izmeni profil</a>
    <button (click)="logout()">Logout</button>
  </ng-container>
  `,
  styles: [`.err{color:#b00020}`]
})
export class ProfileComponent {
  profile: ProfileResponse | null = null;
  loading = false;
  error = '';

  constructor(
    private usersApi: UsersApiService,
    private auth: AuthApiService,
    private router: Router,
    private identity: IdentityService
  ) {}

  ngOnInit(): void {
    this.load();
    this.usersApi.me().subscribe(p => {
      this.identity.set(p.id, p.username);
    });
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.usersApi.me().subscribe({
      next: (p) => (this.profile = p),
      error: (err) => {
        this.error = err?.error?.error ?? 'Ne mogu da učitam profil (da li si ulogovan?).';
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}