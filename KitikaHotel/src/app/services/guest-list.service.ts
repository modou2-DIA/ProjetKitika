import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from './api';
export interface ReservationGuestDTO {
  reservationId?: number;
  clientId?: number;
  clientNom?: string;
  clientPrenom?: string;
  clientTelephone?: string;
  chambreNumero?: string;
  chambreType?: string;
  dateDebut?: string; // ISO date
  dateFin?: string;
  statut?: string;
}

export interface GuestListResponse {
  reservationsPrevues: ReservationGuestDTO[];
  arrivees: ReservationGuestDTO[];
  presents: ReservationGuestDTO[];
  departs: ReservationGuestDTO[];
}

@Injectable({ providedIn: 'root' })
export class GuestListService {
  //private apiUrl = 'http://localhost:8080/api/guest-list';
  // Utilisez l'API constante pour la version distante
   private apiUrl = API + 'guest-list';

  constructor(private http: HttpClient) {}

  getGuestList(dateIso: string): Observable<GuestListResponse> {
    let params = new HttpParams();
    if (dateIso) params = params.set('date', dateIso);
    return this.http.get<GuestListResponse>(this.apiUrl, { params });
  }
  checkInReservation(reservationId: number) {
  return this.http.post(`http://localhost:8080/api/fiches-client/checkin/${reservationId}`, {});

  }
  searchGuestList(nom?: string, prenom?: string, entite?: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search`, {
      params: {
        nom: nom || '',
        prenom: prenom || '',
        entite: entite || ''
      }
    });
  }

}
