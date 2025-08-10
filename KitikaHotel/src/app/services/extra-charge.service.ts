import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ExtraCharge {
  id?: number;
  type: string;
  description?: string;
  montant: number;
}

@Injectable({ providedIn: 'root' })
export class ExtraChargeService {
  private apiUrl = 'http://localhost:8080/api/extra-charges';

  constructor(private http: HttpClient) {}

  getByReservation(reservationId: number): Observable<ExtraCharge[]> {
    return this.http.get<ExtraCharge[]>(`${this.apiUrl}/${reservationId}`);
  }

  add(reservationId: number, charge: ExtraCharge): Observable<ExtraCharge> {
    return this.http.post<ExtraCharge>(`${this.apiUrl}/${reservationId}`, charge);
  }
}
