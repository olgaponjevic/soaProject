import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <h2>Login</h2>

  <form [formGroup]="form" (ngSubmit)="submit()">
    <label>Username</label>
    <input formControlName="username"/>

    <label>Password</label>
    <input type="password" formControlName="password"/>

    <button type="submit" [disabled]="form.invalid || loading">Uloguj se</button>
  </form>

  <p class="err" *ngIf="error">{{error}}</p>
  <p>Nemaš nalog? <a routerLink="/register">Registracija</a></p>
  `,
  styles: [`.err{color:#b00020}`]
})
export class LoginComponent {
  loading = false;
  error = '';

  form;

  constructor(private fb: FormBuilder, private auth: AuthApiService, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit(): void {
    this.error = '';
    if (this.form.invalid) return;

    this.loading = true;
    this.auth.login(this.form.getRawValue() as any).subscribe({
      next: () => this.router.navigateByUrl('/profile'),
      error: (err) => {
        this.error = err?.error?.error ?? 'Pogrešan username/lozinka.';
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }
}