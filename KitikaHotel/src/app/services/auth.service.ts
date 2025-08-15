import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  api = 'http://localhost:8080/api/auth';
  
  // Utilisez des BehaviorSubject pour la réactivité
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  private _userRole = new BehaviorSubject<string | null>(null);
  private _userName = new BehaviorSubject<string | null>(null);

  // Exposez des Observables pour que les composants puissent s'y abonner
  public readonly authStatus$: Observable<boolean> = this._isAuthenticated.asObservable();
  public readonly userRole$: Observable<string | null> = this._userRole.asObservable();
  public readonly userName$: Observable<string | null> = this._userName.asObservable();


  constructor(private http: HttpClient) {
    // Initialisation lors de la création du service
    this.checkInitialAuthStatus();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private checkInitialAuthStatus() {
    if (this.isBrowser()) {
      const storedToken = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');
      const storedUserName = localStorage.getItem('userName');

      if (storedToken) {
        this._isAuthenticated.next(true);
        this._userRole.next(storedRole);
        this._userName.next(storedUserName);
      }
    }
  }

  login(email: string, motDePasse: string): Observable<any> {
    return this.http.post<any>(`${this.api}/login`, { email, motDePasse }).pipe(
      tap(res => {
        if (this.isBrowser()) {
          // Met à jour le localStorage
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('userName', res.nom);

          // Met à jour les BehaviorSubject pour notifier les abonnés
          this._isAuthenticated.next(true);
          this._userRole.next(res.role);
          this._userName.next(res.nom);
        }
      })
    );
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }
  logout() {
    if (this.isBrowser()) {
      // Supprime les données du localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userName');

      // Réinitialise les BehaviorSubject
      this._isAuthenticated.next(false);
      this._userRole.next(null);
      this._userName.next(null);
    }
  }

  // Les méthodes synchrones continuent de fonctionner, mais utilisent les BehaviorSubject
  isAuthenticated(): boolean {
    return this._isAuthenticated.value;
  }

  getRole(): string | null {
    return this._userRole.value;
  }

  getUserName(): string | null {
    return this._userName.value;
  }
}
