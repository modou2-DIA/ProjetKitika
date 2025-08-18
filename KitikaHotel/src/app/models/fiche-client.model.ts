
import { Reservation } from "./reservation.model";
export interface FicheClient {
  id?: number;
  note: string;
  checkin: string;
  checkout: string;

  statut: string;

  reservation:Reservation;
}