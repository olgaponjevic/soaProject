import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import {
  BlogCreateRequest, BlogResponse, CommentCreateRequest, CommentResponse
} from '../models/blog.models';
import { IdentityService } from './identity.service';

@Injectable({ providedIn: 'root' })
export class BlogsApiService {
  private readonly base = `${environment.apiBaseUrl}/api/blogs`;

  constructor(private http: HttpClient, private identity: IdentityService) {}

  create(body: BlogCreateRequest): Observable<BlogResponse> {
    return this.http.post<BlogResponse>(this.base, body);
  }

  get(blogId: string): Observable<BlogResponse> {
    return this.http.get<BlogResponse>(`${this.base}/${blogId}`);
  }

  feed(): Observable<BlogResponse[]> {
    const userId = this.identity.getId();
    if (!userId) return throwError(() => new Error('Missing userId in IdentityService'));
    return this.http.get<BlogResponse[]>(`${this.base}/feed?userId=${userId}`);
  }

  byAuthor(userId: number): Observable<BlogResponse[]> {
    return this.http.get<BlogResponse[]>(`${this.base}/user/${userId}`);
  }

  comments(blogId: string): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(`${this.base}/${blogId}/comments`);
  }

  addComment(blogId: string, body: CommentCreateRequest): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(`${this.base}/${blogId}/comments`, body);
  }
}