// Ce fichier contient tous les services Angular typés correspondant à vos modèles Spring Boot.
// Chaque interface respecte les attributs de vos entités backend.
// Exemple de structure de fichier service avec Angular.

// Exemple pour ChambreService
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from './api'; // Assurez-vous que le chemin est correct
import { Chambre } from '../models/chambre.model';

@Injectable({ providedIn: 'root' })
export class ChambreService {
  private apiUrl = 'http://localhost:8080/api/chambres';
  // Utilisez l'API constante pour la version distante
   //private apiUrl = API + 'chambres';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(this.apiUrl);
  }

  create(chambre: Chambre): Observable<Chambre> {
    return this.http.post<Chambre>(this.apiUrl, chambre);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  update(chambre: Chambre): Observable<Chambre> {
    return this.http.put<Chambre>(`${this.apiUrl}/${chambre.id}`, chambre);
  }
  getById(id: number): Observable<Chambre> {
    return this.http.get<Chambre>(`${this.apiUrl}/${id}`);
  }
  getChambresLibres(): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.apiUrl}/libres`);
  }
}