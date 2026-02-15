import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositionApiService } from '../../core/services/position-api.service';
import { IdentityService } from '../../core/services/identity.service';
import * as L from 'leaflet';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
  <h2>Simulator pozicije</h2>
  <p>Kliknite na mapu da postavite svoju trenutnu lokaciju (simulator).</p>

  <div #map style="height:500px; border:1px solid #ddd"></div>

  <div style="margin-top:12px">
    <div *ngIf="position">Trenutna lokacija: {{position.lat.toFixed(6)}}, {{position.lon.toFixed(6)}} (ažurirano: {{position.updatedAt || '-' }})</div>
    <div *ngIf="!position">Trenutna lokacija nije postavljena.</div>
  </div>
  `
})
export class SimulatorComponent implements AfterViewInit {
  @ViewChild('map', { static: true }) mapRef!: ElementRef<HTMLDivElement>;

  map!: L.Map;
  marker: L.Marker | null = null;
  position: any = null;

  constructor(private api: PositionApiService, private identity: IdentityService) {}

  ngAfterViewInit(): void {
    this.map = L.map(this.mapRef.nativeElement).setView([44.7866, 20.4489], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // try load existing position
    this.api.get().subscribe({ next: (p) => this.showPosition(p.lat, p.lon, p), error: () => {} });

    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat as number;
      const lon = e.latlng.lng as number;
      this.api.upsert(lat, lon).subscribe({ next: (p) => this.showPosition(p.lat, p.lon, p), error: () => alert('Greška pri čuvanju pozicije.') });
    });
  }

  private showPosition(lat: number, lon: number, payload: any) {
    this.position = payload;
    if (this.marker) this.map.removeLayer(this.marker);
    this.marker = L.marker([lat, lon]).addTo(this.map);
    this.map.panTo([lat, lon]);
  }
}
