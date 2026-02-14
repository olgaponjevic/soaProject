import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private token: TokenService, private router: Router) {}

  canActivate(): boolean {
    if (this.token.isLoggedIn()) return true;
    this.router.navigateByUrl('/login');
    return false;
  }
}