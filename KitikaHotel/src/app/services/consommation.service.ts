import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from './produit.service';
import { FicheClient } from './fiche-client.service';
export interface Consommation {
  id?: number;
  type: string;
  description: string;
  montant: number;
  date: string;
  produit: Produit;
  client: FicheClient;
}
@Injectable({
  providedIn: 'root'
})
export class ConsommationService {

  constructor() { }
}
