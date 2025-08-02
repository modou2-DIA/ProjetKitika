import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from './client.service';
import { ChambreService, Chambre } from './chambre.service';
// --- FicheClientService ---
export interface FicheClient {
  id?: number;
  note: string;
  checkin: string;
  checkout: string;
  chambre: Chambre;
  statut: string;
  client: Client;
}

@Injectable({ providedIn: 'root' })
export class FicheClientService {
  private apiUrl = 'http://localhost:8080/api/ficheclients';
  constructor(private http: HttpClient) {}

  getAll(): Observable<FicheClient[]> {
    return this.http.get<FicheClient[]>(this.apiUrl);
  }

  create(fiche: FicheClient): Observable<FicheClient> {
    return this.http.post<FicheClient>(this.apiUrl, fiche);
  }
}