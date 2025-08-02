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
}
