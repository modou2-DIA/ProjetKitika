import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs'; 
import { ChambreService, Chambre } from './chambre.service';
import { ClientService, Client } from './client.service';
import { Utilisateur } from './utilisateur.service'; // Assurez-vous que ce service est défini
// --- ReservationService ---
export interface Reservation {
  id?: number;
  dateDebut: string;
  dateFin: string;
  statut: string;
  total: number;
  client: Client;
  chambre: Chambre;
  receptionniste: Utilisateur;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private apiUrl = 'http://localhost:8080/api/reservations';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  create(res: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, res);
  } 
  getById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`);
  } 
  update(res: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${res.id}`, res);
  } 
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  } 
  getReservationsByClientId(clientId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/client/${clientId}`);
  } 
  getReservationsByChambreId(chambreId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/chambre/${chambreId}`);
  } 
  getReservationsByReceptionnisteId(receptionnisteId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/receptionniste/${receptionnisteId}`);
  } 
  getReservationsByDateRange(startDate: string, endDate: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/date-range?start=${startDate}&end=${endDate}`);
  } 
  getReservationsByStatus(status: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/status/${status}`);
  } 
  getReservationsByTotalRange(minTotal: number, maxTotal: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/total-range?min=${minTotal}&max=${maxTotal}`);
  }  
  checkIn(reservationId?: number): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/${reservationId}/checkin`, {});
  } 
  getChambresLibres(): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.apiUrl}/chambres-libres`);
  }

}