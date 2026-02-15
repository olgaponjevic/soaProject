import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToursApiService } from '../../core/services/tours-api.service';
import { TourResponse } from '../../core/models/tour.models';

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
    </li>
  </ul>
  `
})
export class TourListComponent {
  tours: TourResponse[] = [];
  loading = true;

  constructor(private api: ToursApiService) {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.mine().subscribe({ next: (ts) => (this.tours = ts), error: () => (this.tours = []), complete: () => (this.loading = false) });
  }
}
