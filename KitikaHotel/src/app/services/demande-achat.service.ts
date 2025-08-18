import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../models/produit.model';
import { Utilisateur } from './utilisateur.service';
export interface DemandeAchat {
  id?: number;
  dateDemande: string;
  statut: string;
  commentaire: string;
  produits: Produit[];
  quantite: number;
  demandeur: Utilisateur;
}

@Injectable({ providedIn: 'root' })
export class DemandeAchatService {
  private apiUrl = 'http://localhost:8080/api/demandes';
  constructor(private http: HttpClient) {}

  getAll(): Observable<DemandeAchat[]> {
    return this.http.get<DemandeAchat[]>(this.apiUrl);
  }

  create(demande: DemandeAchat): Observable<DemandeAchat> {
    return this.http.post<DemandeAchat>(this.apiUrl, demande);
  }
}