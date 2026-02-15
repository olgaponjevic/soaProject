import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToursApiService } from '../../core/services/tours-api.service';
import { IdentityService } from '../../core/services/identity.service';
import { AddKeyPointRequest, KeyPoint } from '../../core/models/tour.models';

import * as L from 'leaflet';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <h2>Uređivanje ture - ključne tačke</h2>
  <div style="display:flex; gap:12px; align-items:flex-start">
    <div style="flex:1">
      <div #map style="height:400px; border:1px solid #ddd"></div>
      <p>Kliknite na mapu da odaberete lokaciju. Marker će se pojaviti.</p>
    </div>

    <div style="width:320px">
      <h3>Izabrana tačka</h3>
      <div *ngIf="selected">
        <div><strong>Lat:</strong> {{selected.lat}}</div>
        <div><strong>Lon:</strong> {{selected.lon}}</div>
        <label>Naziv</label>
        <input [(ngModel)]="kpName" />
        <label>Opis</label>
        <textarea [(ngModel)]="kpDesc" rows="4"></textarea>
        <label>Slika (URL)</label>
        <input [(ngModel)]="kpImage" />
        <div style="margin-top:8px">
          <button (click)="savePoint()" [disabled]="saving">Sačuvaj tačku</button>
        </div>
        <p class="err" *ngIf="error">{{error}}</p>
      </div>
      <div *ngIf="!selected">Kliknite na mapu da izaberete tačku.</div>

      <hr />
      <h3>Postojeće tačke</h3>
      <ul>
        <li *ngFor="let p of points">{{p.name}} — ({{p.lat.toFixed(5)}}, {{p.lon.toFixed(5)}})</li>
      </ul>
    </div>
  </div>
  `,
  styles: [`.err{color:#b00020}`]
})
export class TourDetailComponent implements AfterViewInit {
  @ViewChild('map', { static: true }) mapRef!: ElementRef<HTMLDivElement>;

  map!: L.Map;
  marker: L.Marker | null = null;
  selected: { lat: number; lon: number } | null = null;
  kpName = '';
  kpDesc = '';
  kpImage = '';
  saving = false;
  error = '';
  points: KeyPoint[] = [];

  tourId = '';

  constructor(private route: ActivatedRoute, private api: ToursApiService, private identity: IdentityService) {
    this.tourId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngAfterViewInit(): void {
    this.map = L.map(this.mapRef.nativeElement).setView([44.7866, 20.4489], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat as number;
      const lon = e.latlng.lng as number;
      this.selectLocation(lat, lon);
    });
  }

  selectLocation(lat: number, lon: number) {
    this.selected = { lat, lon };
    this.kpName = '';
    this.kpDesc = '';
    this.kpImage = '';

    if (this.marker) this.map.removeLayer(this.marker);
    this.marker = L.marker([lat, lon]).addTo(this.map);
    this.map.panTo([lat, lon]);
  }

  savePoint() {
    if (!this.selected) return;
    const userId = this.identity.getId();
    if (!userId) { this.error = 'Nedostaje userId (uloguj se).'; return; }

    const body: AddKeyPointRequest = {
      authorId: userId,
      name: this.kpName || 'Naziv bez imena',
      description: this.kpDesc || undefined,
      imageUrl: this.kpImage || undefined,
      lat: this.selected.lat,
      lon: this.selected.lon
    };

    this.saving = true;
    this.api.addKeyPoint(this.tourId, body).subscribe({
      next: (t) => {
        // add locally
        this.points.push({ name: body.name, description: body.description, imageUrl: body.imageUrl, lat: body.lat, lon: body.lon });
        this.selected = null;
        if (this.marker) { this.map.removeLayer(this.marker); this.marker = null; }
      },
      error: (err) => { this.error = err?.error?.details ?? err?.error?.error ?? 'Greška pri dodavanju tačke.'; this.saving = false; },
      complete: () => (this.saving = false)
    });
  }
}
