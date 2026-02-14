import { Injectable } from '@angular/core';

const ID_KEY = 'me_id';
const USERNAME_KEY = 'me_username';

@Injectable({ providedIn: 'root' })
export class IdentityService {
  set(id: number, username?: string | null) {
    localStorage.setItem(ID_KEY, String(id));
    if (username) localStorage.setItem(USERNAME_KEY, username);
  }
  getId(): number | null {
    const v = localStorage.getItem(ID_KEY);
    return v ? Number(v) : null;
  }
  getUsername(): string | null {
    return localStorage.getItem(USERNAME_KEY);
  }
  clear() {
    localStorage.removeItem(ID_KEY);
    localStorage.removeItem(USERNAME_KEY);
  }
}
