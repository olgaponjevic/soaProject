import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersApiService } from '../../core/services/users-api.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <h2>Izmena profila</h2>

  <div *ngIf="loading">Učitavanje...</div>
  <p class="err" *ngIf="error">{{error}}</p>

  <form [formGroup]="form" (ngSubmit)="submit()" *ngIf="!loading">
    <label>Ime</label>
    <input formControlName="firstName" />
    <small *ngIf="form.controls.firstName.touched && form.controls.firstName.invalid">Max 80</small>

    <label>Prezime</label>
    <input formControlName="lastName" />
    <small *ngIf="form.controls.lastName.touched && form.controls.lastName.invalid">Max 80</small>

    <label>URL slike</label>
    <input formControlName="profileImageUrl" />

    <label>Biografija</label>
    <textarea formControlName="biography" rows="5"></textarea>
    <small *ngIf="form.controls.biography.touched && form.controls.biography.invalid">Max 2000</small>

    <label>Moto</label>
    <input formControlName="motto" />
    <small *ngIf="form.controls.motto.touched && form.controls.motto.invalid">Max 200</small>

    <button type="submit" [disabled]="form.invalid || saving">Sačuvaj</button>
    <button type="button" (click)="back()">Nazad</button>
  </form>
  `,
  styles: [`.err{color:#b00020}`]
})
export class ProfileEditComponent {
  loading = false;
  saving = false;
  error = '';

  form;

  constructor(private fb: FormBuilder, private usersApi: UsersApiService, private router: Router) {
    this.form = this.fb.group({
      firstName: ['', [Validators.maxLength(80)]],
      lastName: ['', [Validators.maxLength(80)]],
      profileImageUrl: [''],
      biography: ['', [Validators.maxLength(2000)]],
      motto: ['', [Validators.maxLength(200)]],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.usersApi.me().subscribe({
      next: (p) => {
        this.form.patchValue({
          firstName: p.firstName ?? '',
          lastName: p.lastName ?? '',
          profileImageUrl: p.profileImageUrl ?? '',
          biography: p.biography ?? '',
          motto: p.motto ?? '',
        });
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Ne mogu da učitam profil.';
      },
      complete: () => (this.loading = false)
    });
  }

  submit(): void {
    this.error = '';
    if (this.form.invalid) return;

    this.saving = true;
    const payload = this.normalizeEmptyToNull(this.form.getRawValue());

    this.usersApi.updateMe(payload).subscribe({
      next: () => this.router.navigateByUrl('/profile'),
      error: (err) => {
        this.error = err?.error?.error ?? 'Greška pri snimanju profila.';
        this.saving = false;
      },
      complete: () => (this.saving = false)
    });
  }

  back(): void {
    this.router.navigateByUrl('/profile');
  }

  private normalizeEmptyToNull<T extends Record<string, any>>(obj: T): T {
    const copy: any = { ...obj };
    Object.keys(copy).forEach(k => {
      if (typeof copy[k] === 'string' && copy[k].trim() === '') copy[k] = null;
    });
    return copy as T;
  }
}