import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from './api';
// --- UtilisateurService ---
export interface Utilisateur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  role: string;
  actif: boolean;
}

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  //private apiUrl = 'http://localhost:8080/api/utilisateurs';
  // Utilisez l'API constante pour la version distante
   private apiUrl = API + 'utilisateurs';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl);
  }

  create(user: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.apiUrl, user);
  }
}
