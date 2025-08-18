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