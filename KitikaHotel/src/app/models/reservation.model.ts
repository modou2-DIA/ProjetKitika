import { Client } from "./client.model";
import { Chambre } from "./chambre.model";
import { Utilisateur } from "./utilisateur.model";
export interface Reservation {
  id?: number;
  dateDebut: string;
  dateFin: string;
  statut: string;
  total: number;
  client: Client;
  chambre: Chambre;
  receptionniste?: Utilisateur| null;
}