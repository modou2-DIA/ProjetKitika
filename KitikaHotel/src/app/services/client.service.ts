import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from './api';
// --- ClientService ---
export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  type: string; // "particulier" ou "societe"
  societe: string;
  adresse: string;
  nationalite: string;
  numeroPieceIdentite: string;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  //private apiUrl = 'http://localhost:8080/api/clients';
  // Utilisez l'API constante pour la version distante
   private apiUrl = API + 'clients';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  create(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  } 
  update(client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${client.id}`, client);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }
  getSocietes(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/societes`);
  }
  searchClients(nom?: string, prenom?: string, entite?: string): Observable<Client[]> {
    let params = new HttpParams();
    if (nom) params = params.set('nom', nom);
    if (prenom) params = params.set('prenom', prenom);
    if (entite) params = params.set('entite', entite);

    return this.http.get<Client[]>(`${this.apiUrl}/search`, { params });
  }
}