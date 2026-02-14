import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogsApiService } from '../../core/services/blogs-api.service';
import { FollowsApiService } from '../../core/services/follows-api.service';
import { BlogResponse, UserSummary } from '../../core/models/blog.models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div style="display:flex; justify-content:space-between; align-items:center;">
    <h2>Feed</h2>
    <a routerLink="/blogs/new">+ Novi blog</a>
  </div>

  <div *ngIf="loading">Učitavanje...</div>
  <p class="err" *ngIf="error">{{error}}</p>

  <div *ngIf="!loading && blogs.length === 0">
    Nema blogova u feed-u. Zaprati nekog:

    <div *ngFor="let u of recommended" style="display:flex; justify-content:space-between; margin:8px 0;">
      <div><b>{{u.username}}</b> (id: {{u.id}})</div>
      <button (click)="toggleFollow(u.id)" [disabled]="followBusy[u.id]">Follow</button>
    </div>
  </div>

  <div *ngFor="let b of blogs" style="border:1px solid #ddd; padding:12px; border-radius:8px; margin:10px 0;">
    <div style="display:flex; justify-content:space-between; gap:12px;">
      <div>
        <a [routerLink]="['/blogs', b.id]"><b>{{b.title}}</b></a>
        <div style="opacity:0.7; font-size: 12px;">
          {{b.createdAt | date:'medium'}} · autor: {{b.author?.username || '—'}}
        </div>
      </div>

      <div *ngIf="b.author?.id as authorId">
        <button (click)="toggleFollow(authorId)" [disabled]="followBusy[authorId]">
          {{ isFollowing(authorId) ? 'Unfollow' : 'Follow' }}
        </button>
      </div>
    </div>

    <div *ngIf="b.imageUrls?.length" style="display:flex; gap:8px; margin-top:10px; overflow:auto;">
      <img *ngFor="let url of b.imageUrls" [src]="url" width="120" height="80" style="object-fit:cover;border-radius:8px" />
    </div>
  </div>
  `,
  styles: [`.err{color:#b00020}`]
})
export class BlogFeedComponent {
  loading = false;
  error = '';
  blogs: BlogResponse[] = [];
  recommended: UserSummary[] = [];

  followingIds = new Set<number>();
  followBusy: Record<number, boolean> = {};

  constructor(private blogsApi: BlogsApiService, private followsApi: FollowsApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.followsApi.following().subscribe({
      next: (list) => this.followingIds = new Set(list.map(x => x.id)),
      error: () => {}
    });

    this.blogsApi.feed().subscribe({
      next: (res) => this.blogs = res,
      error: (err) => this.error = err?.error?.error ?? 'Greška pri učitavanju feed-a.',
      complete: () => (this.loading = false)
    });

    this.followsApi.recommendations(10).subscribe({
      next: r => this.recommended = r,
      error: () => {}
    });
  }

  isFollowing(userId: number): boolean {
    return this.followingIds.has(userId);
  }

  toggleFollow(userId: number): void {
    this.followBusy[userId] = true;

    const req = this.isFollowing(userId)
      ? this.followsApi.unfollow(userId)
      : this.followsApi.follow(userId);

    req.subscribe({
      next: () => {
        if (this.isFollowing(userId)) this.followingIds.delete(userId);
        else this.followingIds.add(userId);
      },
      error: (err) => this.error = err?.error?.error ?? 'Greška pri follow/unfollow.',
      complete: () => (this.followBusy[userId] = false)
    });
  }
}