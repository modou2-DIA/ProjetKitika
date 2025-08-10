import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from './client.service';
import { Reservation } from './reservation.service';
import { Facture } from './facture.service';
export interface ReservationGroupee {
  id?: number;
  nomGroupe: string;
  dateDebut: string;      // Format ISO 'yyyy-MM-dd'
  dateFin: string;        // Format ISO 'yyyy-MM-dd'
  societe: Client;        // Le client principal (société)
  reservations?: Reservation[]; // Peut être vide à la création
  facture?: Facture;            // Peut être null à la création
}
@Injectable({
  providedIn: 'root'
})
export class ReservationGroupeeService {
  private apiUrl = 'http://localhost:8080/api/reservations-groupees';

  constructor(private http: HttpClient) {}

  creerReservationGroupee(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
    // Nouvelle méthode pour ajouter une réservation à un groupe
  addReservationToGroup(reservationGroupeeId: number, reservationId: number): Observable<any> {
    const url = `${this.apiUrl}/${reservationGroupeeId}/reservations/${reservationId}`;
    return this.http.put(url, {});
  }
}
