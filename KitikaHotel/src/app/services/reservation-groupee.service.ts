import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { Facture } from '../models/facture.model';
import { Reservation } from '../models/reservation.model';
import { API } from './api';

// DTO côté Angular
export interface AddReservationsToGroupDTO {
  reservations: {
    clientId?: number;     // si client existant
    client?: Client;       // si nouveau client
    chambreId: number;
    dateDebut: string;     // ISO 8601
    dateFin: string;       // ISO 8601
  }[];
}

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
  // private apiUrl = API + 'reservations-groupees'; // version distante

  constructor(private http: HttpClient) {}

  creerReservationGroupee(data: ReservationGroupee): Observable<ReservationGroupee> {
    return this.http.post<ReservationGroupee>(this.apiUrl, data);
  }

  getAll(): Observable<ReservationGroupee[]> {
    return this.http.get<ReservationGroupee[]>(this.apiUrl);
  }

  getById(id: number): Observable<ReservationGroupee> {
    return this.http.get<ReservationGroupee>(`${this.apiUrl}/${id}`);
  }

  // Ajouter une réservation existante dans un groupe
  addReservationToGroup(groupId: number, reservationId: number): Observable<ReservationGroupee> {
    const url = `${this.apiUrl}/${groupId}/reservations/${reservationId}`;
    return this.http.put<ReservationGroupee>(url, {});
  }

  // ✅ Nouvelle méthode : ajout multiple de réservations dans un groupe
  addReservationsBulk(groupId: number, dto: AddReservationsToGroupDTO): Observable<ReservationGroupee> {
    const url = `${this.apiUrl}/${groupId}/reservations/bulk`;
    return this.http.post<ReservationGroupee>(url, dto);
  }
}
