import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { UserSummary } from '../models/blog.models';
import { IdentityService } from './identity.service';

@Injectable({ providedIn: 'root' })
export class FollowsApiService {
  private readonly base = `${environment.apiBaseUrl}/api/follows`;

  constructor(private http: HttpClient, private identity: IdentityService) {}

  follow(targetUserId: number): Observable<void> {
    const userId = this.identity.getId();
    const username = this.identity.getUsername();
    if (!userId) return throwError(() => new Error('Missing userId'));
    return this.http.post<void>(`${this.base}/${targetUserId}`, { actor: { userId, username } });
  }

  unfollow(targetUserId: number): Observable<void> {
    const userId = this.identity.getId();
    if (!userId) return throwError(() => new Error('Missing userId'));
    return this.http.delete<void>(`${this.base}/${targetUserId}?userId=${userId}`);
  }

  following(): Observable<UserSummary[]> {
    const userId = this.identity.getId();
    if (!userId) return throwError(() => new Error('Missing userId in IdentityService'));
    return this.http.get<UserSummary[]>(`${this.base}/following?userId=${userId}`);
  }

  followers(): Observable<UserSummary[]> {
    const userId = this.identity.getId();
    if (!userId) return throwError(() => new Error('Missing userId in IdentityService'));
    return this.http.get<UserSummary[]>(`${this.base}/followers?userId=${userId}`);
  }

  recommendations(limit = 10): Observable<UserSummary[]> {
    const userId = this.identity.getId();
    if (!userId) return throwError(() => new Error('Missing userId in IdentityService'));
    return this.http.get<UserSummary[]>(`${this.base}/recommendations?userId=${userId}&limit=${limit}`);
  }
}