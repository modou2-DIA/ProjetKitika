import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  api = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  login(email: string, motDePasse: string) {
    return this.http.post<any>(`${this.api}/login`, { email, motDePasse }).pipe(
      tap(res => {
        if (this.isBrowser()) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('userName', res.nom);
        }
      })
    );
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');
    }
  }

  getToken() {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getRole() {
    return this.isBrowser() ? localStorage.getItem('role') : null;
  }
}
