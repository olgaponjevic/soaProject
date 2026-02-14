import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ProfileResponse, UpdateProfileRequest, RegisterRequest } from '../models/user.models';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly base = `${environment.apiBaseUrl}/api/users`;

  constructor(private http: HttpClient) {}

  register(req: RegisterRequest): Observable<ProfileResponse> {
    return this.http.post<ProfileResponse>(`${this.base}/register`, req);
  }

  me(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.base}/me`);
  }

  updateMe(req: UpdateProfileRequest): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(`${this.base}/me`, req);
  }
}