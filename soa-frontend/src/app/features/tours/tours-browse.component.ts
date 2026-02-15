import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToursApiService } from '../../core/services/tours-api.service';
import { CartApiService } from '../../core/services/cart-api.service';
import { TourResponse } from '../../core/models/tour.models';
import { IdentityService } from '../../core/services/identity.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <h2>Sve ture</h2>
  <div *ngIf="loading">Učitavanje...</div>

  <div *ngIf="!loading && tours.length === 0">Trenutno nema dostupnih tura.</div>

  <div *ngFor="let t of tours" style="border:1px solid #eee; padding:12px; margin-bottom:8px;">
    <div style="display:flex; justify-content:space-between; align-items:center">
      <div>
        <strong>{{t.name}}</strong> — {{t.difficulty}}
      </div>
      <div>
        <span style="font-weight:600">Cena: {{t.price}}</span>
      </div>
    </div>

    <div style="margin-top:8px">{{t.description}}</div>
    <div style="margin-top:8px">Tagovi: <span *ngIf="t.tags?.length">{{t.tags.join(', ')}}</span></div>

    <div style="margin-top:8px">
      <a [routerLink]="['/tours', t.id, 'edit']">Uredi / Detalji</a>
      <button style="margin-left:12px" (click)="addToCart(t)" [disabled]="adding[t.id] || t.status !== 'PUBLISHED'">Dodaj u korpu</button>
      <a [routerLink]="['/executions/start', t.id]" style="margin-left:12px">Pokreni turu</a>
    </div>
  </div>
  `
})
export class ToursBrowseComponent {
  tours: TourResponse[] = [];
  loading = true;
  adding: Record<string, boolean> = {};

  constructor(private toursApi: ToursApiService, private cart: CartApiService, private identity: IdentityService) {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.toursApi.published().subscribe({ next: (ts) => (this.tours = ts), error: () => (this.tours = []), complete: () => (this.loading = false) });
  }

  addToCart(t: TourResponse): void {
    if (t.status !== 'PUBLISHED') return;
    const me = this.identity.getId();
    if (!me) { alert('Molimo ulogujte se pre kupovine.'); return; }
    if (t.authorId === me) { alert('Ne možete kupiti sopstvenu turu.'); return; }

    this.adding[t.id] = true;
    this.cart.add(t.id).subscribe({ next: () => { this.adding[t.id] = false; alert('Dodato u korpu.'); }, error: () => { this.adding[t.id] = false; alert('Greška pri dodavanju u korpu.'); } });
  }
}
