import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from './api';
// --- ProduitService ---
export interface Produit {
  id?: number;
  nom: string;
  type: string;
  stock: number;
  seuilCritique: number;
  prixUnitaire: number;
}

@Injectable({ providedIn: 'root' })
export class ProduitService {
  //private apiUrl = 'http://localhost:8080/api/articles';
  // Utilisez l'API constante pour la version distante
  private apiUrl = API + 'articles';
  constructor(private http: HttpClient) {}

 getAll(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  create(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, produit);
  }

  update(produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${produit.id}`, produit);
  }
}