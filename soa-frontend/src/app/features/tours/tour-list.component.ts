import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToursApiService } from '../../core/services/tours-api.service';
import { TourResponse } from '../../core/models/tour.models';
import { CartApiService } from '../../core/services/cart-api.service';
import { IdentityService } from '../../core/services/identity.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <h2>Moje ture</h2>
  <a routerLink="/tours/new">+ Kreiraj novu turu</a>

  <div *ngIf="loading">Učitavanje...</div>
  <div *ngIf="!loading && tours.length === 0">Nema tura.</div>

  <ul>
    <li *ngFor="let t of tours">
      <strong>{{t.name}}</strong> — {{t.difficulty}} — {{t.status}} — Cena: {{t.price}}<br />
      <span *ngIf="t.tags?.length">Tagovi: {{t.tags.join(', ')}}</span>
      <div style="margin-top:6px">
        <button *ngIf="t.status === 'PUBLISHED' && t.authorId !== identity.getId()" (click)="addToCart(t)">Dodaj u korpu</button>
        <button *ngIf="t.authorId === identity.getId() && t.status !== 'PUBLISHED'" (click)="publish(t)" style="margin-left:8px">Objavi</button>
      </div>
    </li>
  </ul>
  `
})
export class TourListComponent {
  tours: TourResponse[] = [];
  loading = true;

  constructor(private api: ToursApiService, private cart: CartApiService, public identity: IdentityService) {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.mine().subscribe({ next: (ts) => (this.tours = ts), error: () => (this.tours = []), complete: () => (this.loading = false) });
  }

  addToCart(t: TourResponse): void {
    const me = this.identity.getId();
    if (!me) return;
    // prevent adding archived or own tours
    if (t.status === 'ARCHIVED' || t.authorId === me) return;
    this.cart.add(t.id).subscribe({ next: () => this.load(), error: () => {} });
  }

  publish(t: TourResponse): void {
    this.api.publish(t.id).subscribe({ next: () => this.load(), error: () => { alert('Greška pri objavi ture.'); } });
  }
}
