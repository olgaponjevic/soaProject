import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IdentityService } from './identity.service';
import { Observable, throwError } from 'rxjs';
import { ShoppingCart, TourPurchaseToken } from '../models/cart.models';

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private readonly base = `${environment.apiBaseUrl}/api/cart`;

  constructor(private http: HttpClient, private identity: IdentityService) {}

  view(): Observable<ShoppingCart> {
    const userId = this.identity.getId();
    if (!userId) return throwError(() => new Error('Missing userId in IdentityService'));
    return this.http.get<ShoppingCart>(`${this.base}?touristId=${userId}`);
  }

  add(tourId: string): Observable<ShoppingCart> {
    const userId = this.identity.getId();
    if (!userId) return throwError(() => new Error('Missing userId in IdentityService'));
    return this.http.post<ShoppingCart>(`${this.base}/add`, { touristId: userId, tourId });
  }

  remove(tourId: string): Observable<ShoppingCart> {
    const userId = this.identity.getId();
    if (!userId) return throwError(() => new Error('Missing userId in IdentityService'));
    return this.http.post<ShoppingCart>(`${this.base}/remove`, { touristId: userId, tourId });
  }

  checkout(): Observable<TourPurchaseToken[]> {
    const userId = this.identity.getId();
    if (!userId) return throwError(() => new Error('Missing userId in IdentityService'));
    return this.http.post<TourPurchaseToken[]>(`${this.base}/checkout`, { touristId: userId });
  }
}
