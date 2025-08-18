import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { Consommation } from '../models/consommation.model';
import { API } from './api';
import { Reservation } from '../models/reservation.model';


// Interface pour la fiche de séjour
export interface FicheSejour {
  id?: number;
  reservation: Reservation;

  consommations: Consommation[];
}

@Injectable({
  providedIn: 'root'
})
export class FicheSejourService {
  private apiUrl = 'api/fiche-sejours'; // URL de base pour les appels API

  constructor(private http: HttpClient) {}

  /**
   * Crée une fiche de séjour à partir d'une réservation (lors du check-in).
   * @param reservationId L'ID de la réservation.
   * @returns Un Observable de la FicheSejour créée.
   */
  creerFicheDepuisReservation(reservationId: number): Observable<FicheSejour> {
    // Le backend se chargera de créer la fiche en se basant sur l'ID de la réservation.
    return this.http.post<FicheSejour>(this.apiUrl, { reservationId });
  }

  /**
   * Récupère une fiche de séjour par son ID.
   * @param id L'ID de la fiche de séjour.
   * @returns Un Observable de la FicheSejour.
   */
  getById(id: number): Observable<FicheSejour> {
    return this.http.get<FicheSejour>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupère une fiche de séjour à partir de l'ID de la réservation.
   * @param reservationId L'ID de la réservation associée.
   * @returns Un Observable de la FicheSejour correspondante.
   */
  getFicheSejourByReservationId(reservationId: number): Observable<FicheSejour> {
    return this.http.get<FicheSejour>(`${this.apiUrl}/by-reservation/${reservationId}`);
  }

  /**
   * Ajoute une consommation à une fiche de séjour existante.
   * @param ficheSejourId L'ID de la fiche de séjour.
   * @param consommation La consommation à ajouter.
   * @returns Un Observable de la FicheSejour mise à jour.
   */
  ajouterConsommation(ficheSejourId: number, consommation: Consommation): Observable<FicheSejour> {
    // Envoyer la consommation au backend, qui se chargera de la persister et de mettre à jour la fiche.
    return this.http.put<FicheSejour>(`${this.apiUrl}/${ficheSejourId}/consommations`, consommation);
  }
  
}
