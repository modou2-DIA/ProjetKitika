import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produit {
  id: number;
  nom: string;
  prix: number;
  description: string;
  type: string;
}

// Nouvelle interface pour les articles d'une consommation
export interface Article {
  id?: number;
  quantite: number;
  prixTotal: number;
  produit: Produit;
}



// Interface alignée sur le modèle backend
export interface Consommation {
  id?: number;
  date: string;
  description: string;
  articles: Article[];
  montantTotal: number;
}

// DTO pour la création d'une consommation
export interface CreateConsommationDto {
  ficheId: number;
  description?: string;
  articles: {
    produitId: number;
    quantite: number;
  }[];
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
    return this.http.get<Consommation[]>(`${this.apiUrl}/fiche/${ficheSejourId}`);
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
