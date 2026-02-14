import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BlogsApiService } from '../../core/services/blogs-api.service';
import { MarkdownPipe } from '../../core/pipes/markdown.pipe';
import { IdentityService } from '../../core/services/identity.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MarkdownPipe],
  template: `
  <h2>Novi blog</h2>

  <form [formGroup]="form" (ngSubmit)="submit()">
    <label>Naslov</label>
    <input formControlName="title" />
    <div *ngIf="form.controls.title.touched && form.controls.title.invalid" class="err">
      Naslov je obavezan.
    </div>

    <label>Opis (Markdown)</label>
    <textarea formControlName="description" rows="10"></textarea>
    <div *ngIf="form.controls.description.touched && form.controls.description.invalid" class="err">
      Opis je obavezan.
    </div>

    <h3>Slike (opciono)</h3>
    <div formArrayName="imageUrls">
      <div *ngFor="let c of imageUrls.controls; let i = index" style="display:flex; gap:8px; align-items:center;">
        <input [formControlName]="i" placeholder="https://..." style="flex:1" />
        <button type="button" (click)="removeImage(i)">X</button>
      </div>
    </div>
    <button type="button" (click)="addImage()">+ Dodaj sliku</button>

    <div style="margin-top:12px">
      <button type="submit" [disabled]="form.invalid || saving">Kreiraj</button>
      <a routerLink="/blogs/feed" style="margin-left:12px">Nazad</a>
    </div>
  </form>

  <p class="err" *ngIf="error">{{error}}</p>

  <hr />
  <h3>Preview (Markdown)</h3>
  <div [innerHTML]="form.value.description | markdown"></div>
  `,
  styles: [`.err{color:#b00020}`]
})
export class BlogCreateComponent {
  saving = false;
  error = '';

  form;

  constructor(private fb: FormBuilder, private api: BlogsApiService, private router: Router, private identity: IdentityService,) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrls: this.fb.array<string>([])
    });
  }

  get imageUrls(): FormArray {
    return this.form.get('imageUrls') as FormArray;
  }

  addImage(): void {
    this.imageUrls.push(this.fb.control(''));
  }

  removeImage(i: number): void {
    this.imageUrls.removeAt(i);
  }

  submit(): void {
    if (this.form.invalid) return;

    const userId = this.identity.getId();
    const username = this.identity.getUsername();
    if (!userId) {
      this.error = 'Nedostaje userId (uloguj se ponovo).';
      return;
    }

    const raw = this.form.getRawValue();
    const cleaned = (raw.imageUrls ?? [])
      .map(x => (x ?? '').trim())
      .filter(x => x.length > 0);

    this.saving = true;
    this.api.create({
      actor: { userId, username },
      title: raw.title!,
      description: raw.description!,
      imageUrls: cleaned
    }).subscribe({
      next: (b) => this.router.navigateByUrl(`/blogs/${b.id}`),
      error: (err) => {
        this.error = err?.error?.details ?? err?.error?.error ?? 'Greška pri kreiranju bloga.';
        this.saving = false;
      },
      complete: () => (this.saving = false)
    });
  }
}