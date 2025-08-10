import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from './produit.service';
import { FicheSejourService } from './fiche-sejour.service'; // Assurez-vous que ce service et cette interface existent

// Interface alignée sur le modèle backend robuste
export interface Consommation {
  id?: number;
  quantite: number;
  prixTotal: number; // Calculé au backend, mais utile de l'avoir ici
  dateConsommation: string;
  produit: Produit;
  ficheSejour: FicheSejourService; // Assurez-vous que FicheSejour est correctement importé
}

// DTO pour la création, ne contient que les IDs nécessaires
export interface CreateConsommationDto {
  produitId: number;
  ficheSejourId: number;
  quantite: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConsommationService {

  private apiUrl = 'http://localhost:8080/api/consommations';

  constructor(private http: HttpClient) {}

  /**
   * Récupère toutes les consommations associées à un séjour spécifique.
   * @param ficheSejourId L'ID de la fiche de séjour
   */
  getByFicheSejourId(ficheSejourId: number): Observable<Consommation[]> {
    // L'URL pointe vers une API qui retourne les consommations pour un séjour donné
    return this.http.get<Consommation[]>(`http://localhost:8080/api/sejours/${ficheSejourId}/consommations`);
  }

  /**
   * Ajoute une nouvelle consommation à une fiche de séjour.
   * @param dto L'objet de transfert de données pour la création
   */
  ajouter(dto: CreateConsommationDto): Observable<Consommation> {
    return this.http.post<Consommation>(this.apiUrl, dto);
  }

  /**
   * Supprime une consommation par son ID.
   * @param id L'ID de la consommation à supprimer
   */
  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

