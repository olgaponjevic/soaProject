import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BlogsApiService } from '../../core/services/blogs-api.service';
import { FollowsApiService } from '../../core/services/follows-api.service';
import { BlogResponse, CommentResponse } from '../../core/models/blog.models';
import { MarkdownPipe } from '../../core/pipes/markdown.pipe';
import { IdentityService } from '../../core/services/identity.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MarkdownPipe],
  template: `
  <a routerLink="/blogs/feed">← Nazad na feed</a>

  <div *ngIf="loading">Učitavanje...</div>
  <p class="err" *ngIf="error">{{error}}</p>

  <ng-container *ngIf="blog as b">
    <h2>{{b.title}}</h2>
    <div style="opacity:0.7; font-size:12px;">
      {{b.createdAt | date:'medium'}} · autor: <b>{{b.author?.username}}</b>
    </div>

    <div *ngIf="b.author?.id as authorId" style="margin: 10px 0;">
      <button (click)="toggleFollow(authorId)" [disabled]="followBusy">
        {{ isFollowing(authorId) ? 'Unfollow' : 'Follow' }}
      </button>
    </div>

    <div *ngIf="b.imageUrls?.length" style="display:flex; gap:8px; margin:12px 0; overflow:auto;">
      <img *ngFor="let url of b.imageUrls" [src]="url" width="180" height="120"
           style="object-fit:cover;border-radius:10px" />
    </div>

    <h3>Opis</h3>
    <div [innerHTML]="b.description | markdown"></div>

    <hr />
    <h3>Komentari</h3>

    <div *ngIf="canComment === false" style="padding:10px; background:#fff3cd; border-radius:8px;">
      Možeš da ostaviš komentar tek nakon što zapratiš autora.
    </div>

    <form *ngIf="canComment" [formGroup]="commentForm" (ngSubmit)="addComment()" style="margin:12px 0;">
      <textarea rows="3" formControlName="text" placeholder="Napiši komentar..."></textarea>
      <div>
        <button type="submit" [disabled]="commentForm.invalid || commenting">Pošalji</button>
      </div>
    </form>

    <div *ngIf="commentsLoading">Učitavanje komentara...</div>

    <div *ngFor="let c of comments" style="border-top:1px solid #eee; padding:10px 0;">
      <div style="font-size:12px; opacity:0.7;">
        <b>{{c.author?.username || '—'}}</b> · {{c.createdAt | date:'short'}}
      </div>
      <div>{{c.text}}</div>
    </div>
  </ng-container>
  `,
  styles: [`.err{color:#b00020} textarea{width:100%;}`]
})
export class BlogDetailComponent {
  loading = false;
  commentsLoading = false;
  commenting = false;
  error = '';

  blog: BlogResponse | null = null;
  comments: CommentResponse[] = [];

  followingIds = new Set<number>();
  followBusy = false;
  canComment: boolean | null = null;

  commentForm;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private blogsApi: BlogsApiService,
    private followsApi: FollowsApiService,
    private identity: IdentityService
  ) {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.load(id);
  }

  private load(blogId: string): void {
    this.loading = true;
    this.error = '';
    this.canComment = null;

    this.blogsApi.get(blogId).subscribe({
      next: (b) => {
        this.blog = b;
        this.followsApi.following().subscribe({
          next: (list) => {
            this.followingIds = new Set(list.map(x => x.id));
            const authorId = b.author?.id;
            this.canComment = authorId ? this.followingIds.has(authorId) : false;
          },
          error: () => {
            this.canComment = false;
          }
        });

        this.loadComments(blogId);
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Greška pri učitavanju bloga.';
      },
      complete: () => (this.loading = false)
    });
  }

  private loadComments(blogId: string): void {
    this.commentsLoading = true;
    this.blogsApi.comments(blogId).subscribe({
      next: (res) => this.comments = res,
      error: (err) => this.error = err?.error?.error ?? 'Greška pri učitavanju komentara.',
      complete: () => (this.commentsLoading = false)
    });
  }

  isFollowing(userId: number): boolean {
    return this.followingIds.has(userId);
  }

  toggleFollow(userId: number): void {
    this.followBusy = true;

    const req = this.isFollowing(userId)
      ? this.followsApi.unfollow(userId)
      : this.followsApi.follow(userId);

    req.subscribe({
      next: () => {
        if (this.isFollowing(userId)) this.followingIds.delete(userId);
        else this.followingIds.add(userId);

        this.canComment = this.followingIds.has(userId);
      },
      error: (err) => this.error = err?.error?.error ?? 'Greška pri follow/unfollow.',
      complete: () => (this.followBusy = false)
    });
  }

  addComment(): void {
    if (!this.blog) return;
    if (this.commentForm.invalid) return;

    const userId = this.identity.getId();
    const username = this.identity.getUsername();
    if (!userId) {
      this.error = 'Nedostaje userId (uloguj se ponovo).';
      return;
    }

    this.commenting = true;
    const text = this.commentForm.getRawValue().text!.trim();

    this.blogsApi.addComment(this.blog.id, {
      actor: { userId, username },
      text
    }).subscribe({
      next: (c) => {
        this.comments = [c, ...this.comments];
        this.commentForm.reset({ text: '' });
      },
      error: (err) => {
        this.error = err?.error?.details ?? err?.error?.error ?? 'Greška pri slanju komentara.';
      },
      complete: () => (this.commenting = false)
    });
  }
}