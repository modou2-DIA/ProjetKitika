import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from './client.service';
import { Consommation } from './consommation.service';
export interface Facture {
  id?: number;
  dateEmission: string;
  montantTotal: number;
  client: Client;
  consommations: Consommation[];
  payee: boolean;
}
 

@Injectable({ providedIn: 'root' })
export class FactureService {
  private apiUrl = 'http://localhost:8080/api/factures';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Facture[]> {
    return this.http.get<Facture[]>(this.apiUrl);
  }

  create(facture: Facture): Observable<Facture> {
    return this.http.post<Facture>(this.apiUrl, facture);
  }
  marquerCommePayee(id: number): Observable<any> {
  return this.http.patch(`${this.apiUrl}/${id}/payer`, null);
}
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  genererPDF(id: number): void {
  const url = `${this.apiUrl}/${id}/pdf`;
  window.open(url, '_blank');
}
genererFactureDepuisReservation(reservationId: number): Observable<Facture> {
  return this.http.post<Facture>(`${this.apiUrl}/generer/${reservationId}`, {});
}
getFactureByReservationId(reservationId: number): Observable<Facture> {
  return this.http.get<Facture>(`${this.apiUrl}/reservation/${reservationId}`);
}
getById(id: number): Observable<Facture> {
  return this.http.get<Facture>(`${this.apiUrl}/${id}`);
}


}
