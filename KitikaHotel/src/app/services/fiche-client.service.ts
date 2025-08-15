import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from './client.service';
import { ChambreService, Chambre } from './chambre.service';
import { Reservation } from './reservation.service';
import { API } from './api';
// --- FicheClientService ---
export interface FicheClient {
  id?: number;
  note: string;
  checkin: string;
  checkout: string;

  statut: string;

  reservation:Reservation;
}

@Injectable({ providedIn: 'root' })
export class FicheClientService {
  //private apiUrl = 'http://localhost:8080/api/fiches-client';
  // Utilisez l'API constante pour la version distante
  private apiUrl = API + 'fiches-client';
  constructor(private http: HttpClient) {}

  getAll(): Observable<FicheClient[]> {
    return this.http.get<FicheClient[]>(this.apiUrl);
  }

  create(fiche: FicheClient): Observable<FicheClient> {
    return this.http.post<FicheClient>(this.apiUrl, fiche);
  }
  creerFicheDepuisReservation(reservationId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/checkin/${reservationId}`, {});
}
checkoutDepuisReservation(reservationId: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/checkout/${reservationId}`, {});
}

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  update(fiche: FicheClient): Observable<FicheClient> {
    return this.http.put<FicheClient>(`${this.apiUrl}/${fiche.id}`, fiche);
  }
  getById(id: number): Observable<FicheClient> {
    return this.http.get<FicheClient>(`${this.apiUrl}/${id}`);
  }
  getFicheByReservationId(reservationId: number): Observable<FicheClient> {
    return this.http.get<FicheClient>(`${this.apiUrl}/reservation/${reservationId}`);
  }
  getFichesByClientId(clientId: number): Observable<FicheClient[]> {
    return this.http.get<FicheClient[]>(`${this.apiUrl}/client/${clientId}`);
  }
  creerFicheDepuisReservationGroupee(reservationGroupeeId: number): Observable<FicheClient> {
    return this.http.post<FicheClient>(`${this.apiUrl}/reservation-groupee/${reservationGroupeeId}`, {});
  }  

}