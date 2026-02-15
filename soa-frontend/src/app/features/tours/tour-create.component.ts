import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToursApiService } from '../../core/services/tours-api.service';
import { IdentityService } from '../../core/services/identity.service';
import { Difficulty } from '../../core/models/tour.models';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <h2>Kreiraj turu</h2>

  <form [formGroup]="form" (ngSubmit)="submit()">
    <label>Naziv ture</label>
    <input formControlName="name" />
    <div *ngIf="form.controls.name.touched && form.controls.name.invalid" class="err">
      Naziv je obavezan.
    </div>

    <label>Opis</label>
    <textarea formControlName="description" rows="6"></textarea>

    <label>Težina</label>
    <select formControlName="difficulty">
      <option value="EASY">Laka</option>
      <option value="MEDIUM">Srednja</option>
      <option value="HARD">Teška</option>
    </select>

    <h3>Tagovi (opciono)</h3>
    <div formArrayName="tags">
      <div *ngFor="let c of tags.controls; let i = index" style="display:flex; gap:8px; align-items:center;">
        <input [formControlName]="i" placeholder="npr. istorija" style="flex:1" />
        <button type="button" (click)="removeTag(i)">X</button>
      </div>
    </div>
    <button type="button" (click)="addTag()">+ Dodaj tag</button>

    <div style="margin-top:12px">
      <button type="submit" [disabled]="form.invalid || saving">Kreiraj</button>
      <a routerLink="/tours/mine" style="margin-left:12px">Nazad</a>
    </div>
  </form>

  <p class="err" *ngIf="error">{{error}}</p>
  `,
  styles: [`.err{color:#b00020}`]
})
export class TourCreateComponent {
  saving = false;
  error = '';

  form;

  constructor(private fb: FormBuilder, private api: ToursApiService, private router: Router, private identity: IdentityService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      difficulty: ['MEDIUM', Validators.required],
      tags: this.fb.array<string>([])
    });
  }

  get tags(): FormArray {
    return this.form.get('tags') as FormArray;
  }

  addTag(): void {
    this.tags.push(this.fb.control(''));
  }

  removeTag(i: number): void {
    this.tags.removeAt(i);
  }

  submit(): void {
    if (this.form.invalid) return;

    const userId = this.identity.getId();
    const username = this.identity.getUsername();
    if (!userId || !username) {
      this.error = 'Nedostaje userId ili username (uloguj se ponovo).';
      return;
    }

    const raw = this.form.getRawValue();
    const cleanedTags = (raw.tags ?? []).map((x: string | null) => (x ?? '').trim()).filter((x: string) => x.length > 0);

    this.saving = true;
    this.api.create({
      authorId: userId,
      authorUsername: username,
      name: raw.name!,
      description: raw.description,
      difficulty: raw.difficulty as Difficulty,
      tags: cleanedTags
    }).subscribe({
      next: (t) => this.router.navigateByUrl(`/tours/${t.id}/edit`),
      error: (err) => {
        this.error = err?.error?.details ?? err?.error?.error ?? 'Greška pri kreiranju ture.';
        this.saving = false;
      },
      complete: () => (this.saving = false)
    });
  }
}
