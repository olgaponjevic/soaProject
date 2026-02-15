import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IdentityService } from './identity.service';
import { Observable, throwError } from 'rxjs';
import { TourExecution } from '../models/execution.models';

@Injectable({ providedIn: 'root' })
export class ExecutionApiService {
  private readonly base = `${environment.apiBaseUrl}/api/executions`;

  constructor(private http: HttpClient, private identity: IdentityService) {}

  start(tourId: string): Observable<TourExecution> {
    const userId = this.identity.getId();
    if (!userId) return throwError(() => new Error('Missing userId in IdentityService'));
    return this.http.post<TourExecution>(`${this.base}/start`, { touristId: userId, tourId });
  }

  check(executionId: string, radiusMeters?: number): Observable<TourExecution> {
    const userId = this.identity.getId();
    if (!userId) return throwError(() => new Error('Missing userId in IdentityService'));
    const body: any = { touristId: userId };
    if (radiusMeters != null) body.radiusMeters = radiusMeters;
    return this.http.post<TourExecution>(`${this.base}/${executionId}/check`, body);
  }

  complete(executionId: string): Observable<TourExecution> {
    const userId = this.identity.getId();
    if (!userId) return throwError(() => new Error('Missing userId in IdentityService'));
    return this.http.post<TourExecution>(`${this.base}/${executionId}/complete`, { touristId: userId });
  }

  abandon(executionId: string): Observable<TourExecution> {
    const userId = this.identity.getId();
    if (!userId) return throwError(() => new Error('Missing userId in IdentityService'));
    return this.http.post<TourExecution>(`${this.base}/${executionId}/abandon`, { touristId: userId });
  }
}
