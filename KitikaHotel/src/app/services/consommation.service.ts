import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { API } from './api';
import { Consommation } from '../models/consommation.model';

// ✅ DTO corrigé pour correspondre au backend
export interface CreateConsommationDto {
  ficheId: number;
  type?: string;        // ✅ Ajout du champ type
  description?: string;
  articles: {
    nom: string;        // ✅ Nom du produit au lieu de produitId
    quantite: number;
    prixUnitaire: number; // ✅ Prix unitaire requis
    payeur?: 'CLIENT' | 'SOCIETE'; // optionnel selon règle
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ConsommationService {
  
  //private apiUrl = 'http://localhost:8080/api/consommations';
  // Utilisez l'API constante pour la version distante
  private apiUrl = API + 'consommations';

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les consommations associées à un séjour spécifique.
   * @param ficheSejourId L'ID de la fiche de séjour
   */
  getByFicheSejourId(ficheSejourId: number): Observable<Consommation[]> {
    console.log('🌐 Service - Récupération consommations pour fiche:', ficheSejourId);
    
    return this.http.get<Consommation[]>(`${this.apiUrl}/fiche/${ficheSejourId}`).pipe(
      tap(response => console.log('🌐 Service - Consommations reçues:', response)),
      catchError(error => {
        console.error('🌐 Service - Erreur récupération consommations:', error);
        return throwError(error);
      })
    );
  }

  /**
   * ✅ Ajoute une nouvelle consommation - URL CORRIGÉE
   * @param dto L'objet de transfert de données pour la création
   */
  ajouter(dto: CreateConsommationDto): Observable<Consommation> {
    console.log('🌐 Service - DTO envoyé:', dto);
    console.log('🌐 Service - URL complète:', `${this.apiUrl}/ajouter`);
    
    // ✅ URL corrigée pour correspondre au backend
    return this.http.post<Consommation>(`${this.apiUrl}/ajouter`, dto).pipe(
      tap(response => console.log('🌐 Service - Réponse création:', response)),
      catchError(error => {
        console.error('🌐 Service - Erreur création:', error);
        console.error('🌐 Service - Détails erreur:', error.error);
        return throwError(error);
      })
    );
  }

  /**
   * Supprime une consommation par son ID.
   * @param id L'ID de la consommation à supprimer
   */
  supprimer(id: number): Observable<void> {
    console.log('🌐 Service - Suppression consommation:', id);
    
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('🌐 Service - Consommation supprimée:', id)),
      catchError(error => {
        console.error('🌐 Service - Erreur suppression:', error);
        return throwError(error);
      })
    );
  }

  /**
   * ✅ Modifie une consommation existante
   * @param id L'ID de la consommation
   * @param consommation Les nouvelles données
   */
  modifier(id: number, consommation: Consommation): Observable<Consommation> {
    console.log('🌐 Service - Modification consommation:', id, consommation);
    
    return this.http.put<Consommation>(`${this.apiUrl}/${id}`, consommation).pipe(
      tap(response => console.log('🌐 Service - Réponse modification:', response)),
      catchError(error => {
        console.error('🌐 Service - Erreur modification:', error);
        return throwError(error);
      })
    );
  }
}