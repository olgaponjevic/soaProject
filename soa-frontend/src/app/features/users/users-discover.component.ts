import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FollowsApiService } from '../../core/services/follows-api.service';
import { UserSummary } from '../../core/models/blog.models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <h2>Otkrivanje korisnika</h2>
  <p>Pronađite i pratite nove korisnike.</p>

  <div *ngIf="loading">Učitavanje...</div>

  <div *ngIf="!loading && users.length === 0">Nema dostupnih korisnika za otkrivanje.</div>

  <ul>
    <li *ngFor="let u of users" style="padding:8px; border:1px solid #ddd; margin-bottom:8px;">
      <div style="display:flex; justify-content:space-between; align-items:center">
        <span>
          <strong>{{u.username}}</strong> (ID: {{u.id}})
        </span>
        <button (click)="followUser(u)" [disabled]="following[u.id]">Prati</button>
      </div>
    </li>
  </ul>
  `
})
export class UsersDiscoverComponent {
  users: UserSummary[] = [];
  loading = true;
  following: Record<number, boolean> = {};

  constructor(private followsApi: FollowsApiService) {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.followsApi.recommendations().subscribe({
      next: (users) => {
        this.users = users.filter(u => u.id != null);
      },
      error: () => {
        this.users = [];
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  followUser(u: UserSummary): void {
    if (!u.id) return;
    this.following[u.id] = true;
    this.followsApi.follow(u.id).subscribe({
      next: () => {
        this.following[u.id] = false;
        alert(`Sada pratite ${u.username}`);
      },
      error: () => {
        this.following[u.id] = false;
        alert('Greška pri pracenju korisnika.');
      }
    });
  }
}
