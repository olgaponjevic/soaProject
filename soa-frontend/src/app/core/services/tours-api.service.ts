import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { TourCreateRequest, TourResponse, AddKeyPointRequest } from '../models/tour.models';
import { IdentityService } from './identity.service';

@Injectable({ providedIn: 'root' })
export class ToursApiService {
  private readonly base = `${environment.apiBaseUrl}/api/tours`;

  constructor(private http: HttpClient, private identity: IdentityService) {}

  create(body: TourCreateRequest): Observable<TourResponse> {
    return this.http.post<TourResponse>(this.base, body);
  }

  mine(): Observable<TourResponse[]> {
    const userId = this.identity.getId();
    if (!userId) return throwError(() => new Error('Missing userId in IdentityService'));
    return this.http.get<TourResponse[]>(`${this.base}/mine?authorId=${userId}`);
  }

  addKeyPoint(tourId: string, body: AddKeyPointRequest) {
    return this.http.post<TourResponse>(`${this.base}/${tourId}/keypoints`, body);
  }
}
