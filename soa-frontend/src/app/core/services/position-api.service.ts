import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IdentityService } from './identity.service';
import { TouristPosition, UpsertPositionRequest } from '../models/position.models';
import { Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PositionApiService {
  private readonly base = `${environment.apiBaseUrl}/api/position`;

  constructor(private http: HttpClient, private identity: IdentityService) {}

  get(): Observable<TouristPosition> {
    const userId = this.identity.getId();
    if (!userId) return throwError(() => new Error('Missing userId in IdentityService'));
    return this.http.get<TouristPosition>(`${this.base}?touristId=${userId}`);
  }

  upsert(lat: number, lon: number): Observable<TouristPosition> {
    const userId = this.identity.getId();
    if (!userId) return throwError(() => new Error('Missing userId in IdentityService'));
    const body: UpsertPositionRequest = { touristId: userId, lat, lon };
    return this.http.put<TouristPosition>(this.base, body);
  }
}
