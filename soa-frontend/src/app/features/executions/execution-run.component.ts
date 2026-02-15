import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExecutionApiService } from '../../core/services/execution-api.service';
import { PositionApiService } from '../../core/services/position-api.service';
import { TourExecution } from '../../core/models/execution.models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <h2>Aktivna tura</h2>
  <div *ngIf="!execution && starting">Pokrećem turu...</div>
  <div *ngIf="!execution && !starting">Nema aktivne sesije.</div>

  <div *ngIf="execution">
    <div><strong>Tura:</strong> {{execution.tourId}}</div>
    <div><strong>Status:</strong> {{execution.status}}</div>
    <div><strong>Početak:</strong> {{execution.startedAt}}</div>
    <div><strong>Poslednja aktivnost:</strong> {{execution.lastActivityAt}}</div>

    <h3>Kompletirane tačke</h3>
    <ul>
      <li *ngFor="let kp of execution.completedKeyPoints">{{kp.name}} — {{kp.reachedAt}}</li>
    </ul>

    <div style="margin-top:12px">
      <button (click)="complete()" [disabled]="stopping">Završi turu</button>
      <button (click)="abandon()" style="margin-left:8px" [disabled]="stopping">Napusti turu</button>
    </div>
  </div>

  <div style="margin-top:12px"><a routerLink="/tours">Nazad na pregled tura</a></div>
  `
})
export class ExecutionRunComponent implements OnDestroy {
  execution: TourExecution | null = null;
  intervalId: any = null;
  starting = false;
  stopping = false;

  constructor(private route: ActivatedRoute, private api: ExecutionApiService, private pos: PositionApiService) {
    const tourId = this.route.snapshot.paramMap.get('tourId');
    if (tourId) this.start(tourId);
  }

  start(tourId: string) {
    this.starting = true;
    this.api.start(tourId).subscribe({
      next: (e) => {
        this.execution = e;
        this.starting = false;
        this.startPolling();
      },
      error: (err) => { this.starting = false; alert(err?.error?.details ?? 'Greška pri pokretanju ture.'); }
    });
  }

  startPolling() {
    if (!this.execution) return;
    // poll every 10s
    this.intervalId = setInterval(() => this.pollOnce(), 10000);
    // do immediate poll
    this.pollOnce();
  }

  pollOnce() {
    if (!this.execution) return;
    // first query position simulator to ensure latest position exists
    this.pos.get().subscribe({
      next: (_) => {
        this.api.check(this.execution!.id).subscribe({ next: (e) => {
          this.execution = e;
          if (e.status === 'COMPLETED' || e.status === 'ABANDONED') this.stopPolling();
        }, error: () => {} });
      },
      error: () => {
        // position not set - inform the user
        console.warn('Position not set. Use simulator to set your position.');
      }
    });
  }

  complete() {
    if (!this.execution) return;
    this.stopping = true;
    this.api.complete(this.execution.id).subscribe({ next: (e) => { this.execution = e; this.stopping = false; this.stopPolling(); }, error: () => { this.stopping = false; alert('Greška pri završetku ture.'); } });
  }

  abandon() {
    if (!this.execution) return;
    this.stopping = true;
    this.api.abandon(this.execution.id).subscribe({ next: (e) => { this.execution = e; this.stopping = false; this.stopPolling(); }, error: () => { this.stopping = false; alert('Greška pri napuštanju ture.'); } });
  }

  stopPolling() {
    if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}
