import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersApiService } from '../../core/services/users-api.service';
import { USER_ROLE } from '../../core/models/user-role';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <h2>Registracija</h2>

  <form [formGroup]="form" (ngSubmit)="submit()">
    <label>Korisničko ime</label>
    <input formControlName="username" />
    <div *ngIf="form.controls.username.touched && form.controls.username.invalid">
      Username je obavezan (max 50).
    </div>

    <label>Email</label>
    <input formControlName="email" />
    <div *ngIf="form.controls.email.touched && form.controls.email.invalid">
      Unesi validan email.
    </div>

    <label>Lozinka</label>
    <input type="password" formControlName="password" />
    <div *ngIf="form.controls.password.touched && form.controls.password.invalid">
      Min 8 karaktera.
    </div>

    <label>Uloga</label>
    <select formControlName="role">
      <option [ngValue]="USER_ROLE.Guide">Vodič</option>
      <option [ngValue]="USER_ROLE.Tourist">Turista</option>
    </select>

    <button type="submit" [disabled]="form.invalid || loading">Napravi nalog</button>
  </form>

  <p class="err" *ngIf="error">{{error}}</p>
  <p>Već imaš nalog? <a routerLink="/login">Login</a></p>
  `,
  styles: [`.err{color:#b00020}`]
})
export class RegisterComponent {
  loading = false;
  error = '';

  form;
  USER_ROLE = USER_ROLE;

  constructor(
    private fb: FormBuilder,
    private usersApi: UsersApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(200)]],
      role: [USER_ROLE.Tourist, [Validators.required]],
    });
  }

  submit(): void {
    this.error = '';
    if (this.form.invalid) return;

    this.loading = true;
    this.usersApi.register(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Greška pri registraciji.';
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }
}