import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartApiService } from '../../core/services/cart-api.service';
import { ShoppingCart } from '../../core/models/cart.models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <h2>Korpa</h2>
  <div *ngIf="loading">Učitavanje korpe...</div>
  <div *ngIf="!loading && !cart">Nemate korpu.</div>

  <div *ngIf="cart">
    <ul>
      <li *ngFor="let it of cart.items; let i = index" style="display:flex; gap:12px; align-items:center;">
        <div style="flex:1">
          <strong>{{it.tourName}}</strong><br />
          Cena: {{it.price}}
        </div>
        <div>
          <button (click)="remove(it.tourId)">Ukloni</button>
        </div>
      </li>
    </ul>

    <div style="margin-top:12px">
      <strong>Ukupno: {{cart.total}}</strong>
    </div>

    <div style="margin-top:12px">
      <button (click)="checkout()" [disabled]="checkingOut">Checkout</button>
      <a routerLink="/tours/mine" style="margin-left:12px">Nazad</a>
    </div>

    <div *ngIf="tokens && tokens.length">
      <h3>Tokeni kupovine</h3>
      <ul>
        <li *ngFor="let tk of tokens">{{tk.tourId}} — {{tk.id}} — {{tk.createdAt}}</li>
      </ul>
    </div>
  </div>
  `
})
export class CartComponent {
  cart: ShoppingCart | null = null;
  loading = true;
  checkingOut = false;
  tokens: any[] = [];

  constructor(private api: CartApiService) {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.view().subscribe({ next: (c) => (this.cart = c), error: () => (this.cart = null), complete: () => (this.loading = false) });
  }

  remove(tourId: string): void {
    this.api.remove(tourId).subscribe({ next: (c) => (this.cart = c), error: () => {}, complete: () => {} });
  }

  checkout(): void {
    if (!this.cart || this.cart.items.length === 0) return;
    this.checkingOut = true;
    this.api.checkout().subscribe({ next: (t) => { this.tokens = t; this.load(); }, error: () => { this.checkingOut = false; }, complete: () => (this.checkingOut = false) });
  }
}
