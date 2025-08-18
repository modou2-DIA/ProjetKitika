import { Client } from "./client.model";
import { Consommation } from "./consommation.model";
import { Reservation } from "./reservation.model";
export interface Facture {
  id?: number;
  dateEmission: string;
  montantTotal: number;
  client: Client;
  consommations: Consommation[];
  payee: boolean;
  reservation?: Reservation; // Optionnel si la facture est liée à une réservation
}